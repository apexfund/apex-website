import { internalAction, internalMutation } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'

const tableArg = v.union(v.literal('placements'), v.literal('sponsors'))

/** The dev deployment we copy logos from. */
const DEV_URL = 'https://grand-vulture-41.convex.cloud'

type SourceItem = { name: string; order: number; url: string | null }

/**
 * Delete every row (and its stored file) from a logo table. Used to make an
 * import idempotent so re-running mirrors the source exactly instead of
 * duplicating rows.
 */
export const clearTable = internalMutation({
  args: { table: tableArg },
  returns: v.number(),
  handler: async (ctx, { table }) => {
    const rows = await ctx.db.query(table).collect()
    for (const row of rows) {
      await ctx.storage.delete(row.storageId)
      await ctx.db.delete(row._id)
    }
    return rows.length
  },
})

export const insertLogo = internalMutation({
  args: {
    table: tableArg,
    name: v.string(),
    storageId: v.id('_storage'),
    order: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, { table, name, storageId, order }) => {
    await ctx.db.insert(table, { name, storageId, order })
    return null
  },
})

/**
 * Copy a logo table (placements or sponsors) from another Convex deployment
 * into this one, including the stored image files. Reads the source deployment's
 * public `list` query over HTTP, re-downloads each file, stores it locally, and
 * inserts a matching row preserving name and order.
 */
export const importLogos = internalAction({
  args: {
    table: tableArg,
    sourceUrl: v.string(),
    replaceExisting: v.optional(v.boolean()),
  },
  returns: v.object({ cleared: v.number(), imported: v.number() }),
  handler: async (ctx, { table, sourceUrl, replaceExisting }) => {
    let cleared = 0
    if (replaceExisting) {
      cleared = await ctx.runMutation(internal.migrate.clearTable, { table })
    }

    const res = await fetch(`${sourceUrl.replace(/\/$/, '')}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: `${table}:list`, args: {}, format: 'json' }),
    })
    if (!res.ok) {
      throw new Error(`Source query request failed: ${res.status} ${res.statusText}`)
    }
    const data = (await res.json()) as { status: string; value: SourceItem[]; errorMessage?: string }
    if (data.status !== 'success') {
      throw new Error(`Source query error: ${data.errorMessage ?? JSON.stringify(data)}`)
    }

    const items = [...data.value].sort((a, b) => a.order - b.order)
    let imported = 0
    for (const item of items) {
      if (!item.url) continue
      const fileRes = await fetch(item.url)
      if (!fileRes.ok) {
        throw new Error(`Failed to download file for "${item.name}": ${fileRes.status}`)
      }
      const blob = await fileRes.blob()
      const storageId = await ctx.storage.store(blob)
      await ctx.runMutation(internal.migrate.insertLogo, {
        table,
        name: item.name,
        storageId,
        order: item.order,
      })
      imported++
    }

    return { cleared, imported }
  },
})

/**
 * One-shot convenience: mirror both placements and sponsors from the dev
 * deployment into this one. Takes no args so it's trivial to invoke from the
 * CLI (`npx convex run --prod migrate:importAllFromDev`).
 */
type ImportResult = { cleared: number; imported: number }
const resultShape = v.object({ cleared: v.number(), imported: v.number() })

export const importAllFromDev = internalAction({
  args: {},
  returns: v.object({ placements: resultShape, sponsors: resultShape }),
  handler: async (ctx): Promise<{ placements: ImportResult; sponsors: ImportResult }> => {
    const placements: ImportResult = await ctx.runAction(internal.migrate.importLogos, {
      table: 'placements',
      sourceUrl: DEV_URL,
      replaceExisting: true,
    })
    const sponsors: ImportResult = await ctx.runAction(internal.migrate.importLogos, {
      table: 'sponsors',
      sourceUrl: DEV_URL,
      replaceExisting: true,
    })
    return { placements, sponsors }
  },
})
