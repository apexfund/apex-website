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
 * Return a short-lived URL that the admin client POSTs the member photo to.
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
    role: v.string(),
    team: v.optional(v.string()),
    execBoard: v.optional(v.boolean()),
    linkedIn: v.optional(v.string()),
    storageId: v.optional(v.id('_storage')),
  },
  returns: v.id('teamMembers'),
  handler: async (ctx, { sessionToken, name, role, team, execBoard, linkedIn, storageId }) => {
    await requireAdminSession(ctx, sessionToken)
    return await ctx.db.insert('teamMembers', {
      name,
      role,
      ...(team ? { team } : {}),
      ...(execBoard ? { execBoard } : {}),
      ...(linkedIn ? { linkedIn } : {}),
      ...(storageId ? { storageId } : {}),
    })
  },
})

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('teamMembers'),
    _creationTime: v.number(),
    name: v.string(),
    role: v.string(),
    team: v.union(v.string(), v.null()),
    execBoard: v.boolean(),
    linkedIn: v.union(v.string(), v.null()),
    storageId: v.union(v.id('_storage'), v.null()),
    url: v.union(v.string(), v.null()),
  })),
  handler: async (ctx) => {
    const members = await ctx.db.query('teamMembers').collect()
    members.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    return await Promise.all(
      members.map(async (m) => ({
        _id: m._id,
        _creationTime: m._creationTime,
        name: m.name,
        role: m.role,
        team: m.team ?? null,
        execBoard: m.execBoard ?? false,
        linkedIn: m.linkedIn ?? null,
        storageId: m.storageId ?? null,
        url: m.storageId ? await ctx.storage.getUrl(m.storageId) : null,
      }))
    )
  },
})

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id('teamMembers'),
    name: v.string(),
    role: v.string(),
    team: v.optional(v.string()),
    execBoard: v.optional(v.boolean()),
    linkedIn: v.optional(v.string()),
    storageId: v.optional(v.id('_storage')),
  },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id, name, role, team, execBoard, linkedIn, storageId }) => {
    await requireAdminSession(ctx, sessionToken)
    const doc = await ctx.db.get(id)
    if (!doc) throw new Error('Team member not found')
    await ctx.db.patch(id, {
      name,
      role,
      team: team && team.trim() ? team : undefined,
      execBoard: execBoard ? true : undefined,
      linkedIn: linkedIn && linkedIn.trim() ? linkedIn : undefined,
      ...(storageId ? { storageId } : {}),
    })
    if (storageId && doc.storageId && doc.storageId !== storageId) {
      await ctx.storage.delete(doc.storageId)
    }
    return null
  },
})

export const remove = mutation({
  args: { sessionToken: v.string(), id: v.id('teamMembers') },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id }) => {
    await requireAdminSession(ctx, sessionToken)
    const doc = await ctx.db.get(id)
    if (doc) {
      if (doc.storageId) await ctx.storage.delete(doc.storageId)
      await ctx.db.delete(id)
    }
    return null
  },
})
