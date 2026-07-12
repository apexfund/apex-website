import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

/**
 * Validate a password against the ADMIN_PASSWORD environment variable and,
 * if correct, create a session token stored in the adminSessions table.
 * Returns the token string on success, or null on failure.
 *
 * Set the password via: npx convex env set ADMIN_PASSWORD "your-password-here"
 */
export const adminLogin = mutation({
  args: { password: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, { password }) => {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || password !== adminPassword) return null

    const token = crypto.randomUUID()
    await ctx.db.insert('adminSessions', { token, createdAt: Date.now() })
    return token
  },
})

/**
 * Invalidate a session by deleting it from the database.
 */
export const adminLogout = mutation({
  args: { token: v.string() },
  returns: v.null(),
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', q => q.eq('token', token))
      .first()
    if (session) await ctx.db.delete(session._id)
    return null
  },
})

/**
 * Check whether a session token is still valid. Used on page load to
 * verify a token stored in localStorage is still active in the database.
 */
export const validateSession = query({
  args: { token: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', q => q.eq('token', token))
      .first()
    return session !== null
  },
})
