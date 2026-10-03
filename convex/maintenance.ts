import { internalMutation } from './_generated/server'
import { v } from 'convex/values'

/**
 * One-off helpers for scripts/shrink-team-photos.mjs, run with
 * `npx convex run`. Internal only — not callable from the public internet.
 */
export const generateUploadUrl = internalMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

/** Point a team member at a new photo and delete the old stored file. */
export const replaceTeamPhoto = internalMutation({
  args: {
    id: v.id('teamMembers'),
    oldStorageId: v.id('_storage'),
    newStorageId: v.id('_storage'),
  },
  returns: v.null(),
  handler: async (ctx, { id, oldStorageId, newStorageId }) => {
    const doc = await ctx.db.get(id)
    if (!doc) throw new Error('Team member not found')
    // Guard against racing an admin edit: only swap if the photo is still the one we resized.
    if (doc.storageId !== oldStorageId) throw new Error('Photo changed since it was read; skipping')
    await ctx.db.patch(id, { storageId: newStorageId })
    await ctx.storage.delete(oldStorageId)
    return null
  },
})
