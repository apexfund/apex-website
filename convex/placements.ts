import { query, mutation, type MutationCtx } from './_generated/server'
import { v } from 'convex/values'

async function requireAdminSession(ctx: MutationCtx, token: string) {
  const session = await ctx.db
    .query('adminSessions')
    .withIndex('by_token', q => q.eq('token', token))
    .first()
  if (!session) throw new Error('Unauthorized: invalid or expired session')
}

/**
 * Return a short-lived URL that the admin client POSTs the logo file to.
 * The upload itself happens directly from the browser to Convex storage.
 */
export const generateUploadUrl = mutation({
  args: { sessionToken: v.string() },
  returns: v.string(),
  handler: async (ctx, { sessionToken }) => {
    await requireAdminSession(ctx, sessionToken)
    return await ctx.storage.generateUploadUrl()
  },
})

export const create = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    storageId: v.id('_storage'),
  },
  returns: v.id('placements'),
  handler: async (ctx, { sessionToken, name, storageId }) => {
    await requireAdminSession(ctx, sessionToken)
    const existing = await ctx.db.query('placements').collect()
    const order = existing.length
    return await ctx.db.insert('placements', { name, storageId, order })
  },
})

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('placements'),
    _creationTime: v.number(),
    name: v.string(),
    storageId: v.id('_storage'),
    order: v.number(),
    url: v.union(v.string(), v.null()),
  })),
  handler: async (ctx) => {
    const placements = await ctx.db.query('placements').collect()
    placements.sort((a, b) => a.order - b.order)
    return await Promise.all(
      placements.map(async (p) => ({
        ...p,
        url: await ctx.storage.getUrl(p.storageId),
      }))
    )
  },
})

export const rename = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id('placements'),
    name: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id, name }) => {
    await requireAdminSession(ctx, sessionToken)
    await ctx.db.patch(id, { name })
    return null
  },
})

export const replaceImage = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id('placements'),
    storageId: v.id('_storage'),
  },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id, storageId }) => {
    await requireAdminSession(ctx, sessionToken)
    const doc = await ctx.db.get(id)
    if (!doc) throw new Error('Placement not found')
    const oldStorageId = doc.storageId
    await ctx.db.patch(id, { storageId })
    if (oldStorageId !== storageId) {
      await ctx.storage.delete(oldStorageId)
    }
    return null
  },
})

export const reorder = mutation({
  args: {
    sessionToken: v.string(),
    orderedIds: v.array(v.id('placements')),
  },
  returns: v.null(),
  handler: async (ctx, { sessionToken, orderedIds }) => {
    await requireAdminSession(ctx, sessionToken)
    for (let i = 0; i < orderedIds.length; i++) {
      await ctx.db.patch(orderedIds[i], { order: i })
    }
    return null
  },
})

export const remove = mutation({
  args: { sessionToken: v.string(), id: v.id('placements') },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id }) => {
    await requireAdminSession(ctx, sessionToken)
    const doc = await ctx.db.get(id)
    if (doc) {
      await ctx.storage.delete(doc.storageId)
      await ctx.db.delete(id)
    }
    return null
  },
})
