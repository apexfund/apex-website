import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  articles: defineTable({
    title: v.string(),
    date: v.string(),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.string(),
    slug: v.string(),
  }).index('by_slug', ['slug']),
})
