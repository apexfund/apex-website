import { query, mutation, type MutationCtx } from './_generated/server'
import { v } from 'convex/values'

async function requireAdminSession(ctx: MutationCtx, token: string) {
  const session = await ctx.db
    .query('adminSessions')
    .withIndex('by_token', q => q.eq('token', token))
    .first()
  if (!session) throw new Error('Unauthorized: invalid or expired session')
}

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
  returns: v.id('sponsors'),
  handler: async (ctx, { sessionToken, name, storageId }) => {
    await requireAdminSession(ctx, sessionToken)
    const existing = await ctx.db.query('sponsors').collect()
    const order = existing.length
    return await ctx.db.insert('sponsors', { name, storageId, order })
  },
})

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('sponsors'),
    _creationTime: v.number(),
    name: v.string(),
    storageId: v.id('_storage'),
    order: v.number(),
    url: v.union(v.string(), v.null()),
  })),
  handler: async (ctx) => {
    const sponsors = await ctx.db.query('sponsors').collect()
    sponsors.sort((a, b) => a.order - b.order)
    return await Promise.all(
      sponsors.map(async (s) => ({
        ...s,
        url: await ctx.storage.getUrl(s.storageId),
      }))
    )
  },
})

export const rename = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id('sponsors'),
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
    id: v.id('sponsors'),
    storageId: v.id('_storage'),
  },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id, storageId }) => {
    await requireAdminSession(ctx, sessionToken)
    const doc = await ctx.db.get(id)
    if (!doc) throw new Error('Sponsor not found')
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
    orderedIds: v.array(v.id('sponsors')),
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
  args: { sessionToken: v.string(), id: v.id('sponsors') },
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
