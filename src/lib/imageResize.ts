/**
 * Downscale and re-encode an image file before it's uploaded to Convex
 * storage. Uploaded originals (e.g. full-resolution phone photos) were
 * often far larger than anything the site ever displays them at, and every
 * byte stored gets re-served — and billed as Data Egress — to every visitor.
 * PNGs are kept as PNG (logos rely on transparency); everything else is
 * re-encoded as JPEG.
 */
export async function resizeImage(file: File, maxDimension: number, quality = 0.85): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  if (scale === 1 && outputType === file.type) {
    bitmap.close()
    return file
  }

  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, outputType, quality))
  if (!blob || blob.size >= file.size) return file

  const name = outputType === 'image/jpeg' ? file.name.replace(/\.[^.]+$/, '.jpg') : file.name
  return new File([blob], name, { type: outputType })
}
