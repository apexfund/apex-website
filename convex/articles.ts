import { query, mutation, type MutationCtx } from './_generated/server'
import { v } from 'convex/values'

async function requireAdminSession(ctx: MutationCtx, token: string) {
  const session = await ctx.db
    .query('adminSessions')
    .withIndex('by_token', q => q.eq('token', token))
    .first()
  if (!session) throw new Error('Unauthorized: invalid or expired session')
}

const articleFields = {
  _id: v.id('articles'),
  _creationTime: v.number(),
  title: v.string(),
  date: v.string(),
  category: v.optional(v.string()),
  description: v.optional(v.string()),
  content: v.string(),
  slug: v.string(),
  images: v.optional(v.array(v.id('_storage'))),
}

export const list = query({
  args: {},
  returns: v.array(v.object(articleFields)),
  handler: async (ctx) => {
    const articles = await ctx.db.query('articles').collect()
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(v.object(articleFields), v.null()),
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query('articles')
      .withIndex('by_slug', q => q.eq('slug', slug))
      .first()
  },
})

/**
 * Return a short-lived URL that the admin client POSTs an article image to,
 * then resolve the stored file to a public URL for embedding in markdown.
 */
export const generateUploadUrl = mutation({
  args: { sessionToken: v.string() },
  returns: v.string(),
  handler: async (ctx, { sessionToken }) => {
    await requireAdminSession(ctx, sessionToken)
    return await ctx.storage.generateUploadUrl()
  },
})

export const getImageUrl = mutation({
  args: { sessionToken: v.string(), storageId: v.id('_storage') },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { sessionToken, storageId }) => {
    await requireAdminSession(ctx, sessionToken)
    return await ctx.storage.getUrl(storageId)
  },
})

export const create = mutation({
  args: {
    sessionToken: v.string(),
    title: v.string(),
    date: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
    slug: v.string(),
    images: v.optional(v.array(v.id('_storage'))),
  },
  returns: v.id('articles'),
  handler: async (ctx, { sessionToken, ...fields }) => {
    await requireAdminSession(ctx, sessionToken)
    return await ctx.db.insert('articles', fields)
  },
})

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id('articles'),
    title: v.string(),
    date: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
    slug: v.string(),
    images: v.optional(v.array(v.id('_storage'))),
  },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id, ...fields }) => {
    await requireAdminSession(ctx, sessionToken)
    await ctx.db.patch(id, fields)
    return null
  },
})

export const remove = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id('articles'),
  },
  returns: v.null(),
  handler: async (ctx, { sessionToken, id }) => {
    await requireAdminSession(ctx, sessionToken)
    const doc = await ctx.db.get(id)
    if (doc?.images) {
      for (const storageId of doc.images) {
        await ctx.storage.delete(storageId)
      }
    }
    await ctx.db.delete(id)
    return null
  },
})
