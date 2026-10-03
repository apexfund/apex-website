import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import type { Id } from './_generated/dataModel'

const http = httpRouter()

/**
 * Serves stored files with a long-lived, immutable Cache-Control header.
 * `ctx.storage.getUrl()`'s own endpoint sends no caching headers, so every
 * visitor re-downloads full images on every page load — this is what was
 * driving the project's Convex Data Egress usage. Storage ids are never
 * reused for different content (replacing an image creates a new id), so
 * caching a given id's response forever is safe.
 */
http.route({
  pathPrefix: '/files/',
  method: 'GET',
  handler: httpAction(async (ctx, req) => {
    const storageId = new URL(req.url).pathname.slice('/files/'.length) as Id<'_storage'>
    const blob = await ctx.storage.get(storageId)
    if (!blob) return new Response('Not found', { status: 404 })
    return new Response(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }),
})

export default http
