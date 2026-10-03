import type { Id } from './_generated/dataModel'

/**
 * Build a URL for a stored file that's served through our own `/files/:id`
 * HTTP action (see `http.ts`) instead of the raw `ctx.storage.getUrl()`
 * endpoint. The raw endpoint sends no caching headers, so every visitor
 * re-downloads the full file on every page load; ours sets a long
 * `Cache-Control` since file content at a given storage id never changes.
 */
export function fileUrl(storageId: Id<'_storage'>): string {
  return `${process.env.CONVEX_SITE_URL}/files/${storageId}`
}
