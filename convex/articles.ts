import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query('articles').collect()
    return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query('articles')
      .withIndex('by_slug', q => q.eq('slug', slug))
      .first()
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('articles', args)
  },
})

export const update = mutation({
  args: {
    id: v.id('articles'),
    title: v.string(),
    date: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('articles') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})
