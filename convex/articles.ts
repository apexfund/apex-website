import { query, mutation, type MutationCtx } from './_generated/server'
import { v } from 'convex/values'

async function requireAdminSession(ctx: MutationCtx, token: string) {
  const session = await ctx.db
    .query('adminSessions')
    .withIndex('by_token', q => q.eq('token', token))
    .first()
  if (!session) throw new Error('Unauthorized: invalid or expired session')
}

export const list = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('articles'),
    _creationTime: v.number(),
    title: v.string(),
    date: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
    slug: v.string(),
  })),
  handler: async (ctx) => {
    const articles = await ctx.db.query('articles').collect()
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('articles'),
      _creationTime: v.number(),
      title: v.string(),
      date: v.string(),
      category: v.optional(v.string()),
      description: v.optional(v.string()),
      content: v.string(),
      slug: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query('articles')
      .withIndex('by_slug', q => q.eq('slug', slug))
      .first()
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
    await ctx.db.delete(id)
    return null
  },
})
