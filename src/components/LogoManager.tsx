import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

const SERIF = 'Georgia, serif'
const TEXT = '#0C1929'
const ACCENT = '#96BFCF'

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: '#9CA3AF',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.12)',
  fontSize: 14, outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff',
}

type LogoItem = {
  _id: Id<'placements'>
  _creationTime: number
  name: string
  storageId: Id<'_storage'>
  order: number
  url: string | null
}

/**
 * Admin UI for managing a collection of logos (upload, rename, replace the
 * image, drag-to-reorder, delete). Works for any Convex module that exposes the
 * same function shape (placements, sponsors, …); pass that module via `apiModule`.
 */
export default function LogoManager({
  sessionToken,
  apiModule,
  heading,
  blurb,
}: {
  sessionToken: string
  apiModule: typeof api.placements
  heading: string
  blurb: string
}) {
  const listResult = useQuery(apiModule.list)
  const items = useMemo(() => (listResult ?? []) as LogoItem[], [listResult])
  const generateUploadUrl = useMutation(apiModule.generateUploadUrl)
  const createItem = useMutation(apiModule.create)
  const removeItem = useMutation(apiModule.remove)
  const reorderItems = useMutation(apiModule.reorder)
  const renameItem = useMutation(apiModule.rename)
  const replaceImage = useMutation(apiModule.replaceImage)

  const [logoName, setLogoName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Id<'placements'> | null>(null)
  const [editing, setEditing] = useState<Id<'placements'> | null>(null)
  const [nameDraft, setNameDraft] = useState('')
  const [replacingId, setReplacingId] = useState<Id<'placements'> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const replaceTargetRef = useRef<Id<'placements'> | null>(null)

  // Local ordering so drag-and-drop feels instant; kept in sync with the query.
  const [order, setOrder] = useState<LogoItem[]>(items)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setOrder(prev => {
      if (dragIndex !== null) return prev // don't disrupt an in-progress drag
      const sameOrder =
        prev.length === items.length &&
        prev.every((p, i) => p._id === items[i]._id && p.url === items[i].url && p.name === items[i].name)
      return sameOrder ? prev : items
    })
  }, [items, dragIndex])

  // Fast auto-scroll while dragging near the top/bottom edge of the viewport.
  // The browser's native drag auto-scroll is sluggish, so we drive it ourselves.
  useEffect(() => {
    if (dragIndex === null) return
    const EDGE = 140      // px from an edge where auto-scroll kicks in
    const MAX_SPEED = 42  // px per frame at the very edge
    let pointerY = window.innerHeight / 2
    let raf = 0
    const onDragOver = (e: DragEvent) => { pointerY = e.clientY; e.preventDefault() }
    const tick = () => {
      const h = window.innerHeight
      let dy = 0
      if (pointerY < EDGE) dy = -(1 - pointerY / EDGE) * MAX_SPEED
      else if (pointerY > h - EDGE) dy = (1 - (h - pointerY) / EDGE) * MAX_SPEED
      if (dy !== 0) window.scrollBy(0, dy)
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('dragover', onDragOver)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('dragover', onDragOver)
      cancelAnimationFrame(raf)
    }
  }, [dragIndex])

  async function uploadFileToStorage(file: File): Promise<Id<'_storage'>> {
    const postUrl = await generateUploadUrl({ sessionToken })
    const res = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    })
    if (!res.ok) throw new Error('Upload failed')
    const { storageId } = await res.json()
    return storageId as Id<'_storage'>
  }

  async function handleUpload(file: File) {
    if (file.type !== 'image/png') {
      setUploadError('Please choose a transparent PNG file.')
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const storageId = await uploadFileToStorage(file)
      const name = (logoName.trim() || file.name.replace(/\.[^.]+$/, '')).slice(0, 60)
      await createItem({ sessionToken, name, storageId })
      setLogoName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

  function pickReplacement(id: Id<'placements'>) {
    replaceTargetRef.current = id
    replaceInputRef.current?.click()
  }

  async function handleReplace(file: File) {
    const id = replaceTargetRef.current
    if (replaceInputRef.current) replaceInputRef.current.value = ''
    if (!id) return
    if (file.type !== 'image/png') {
      setUploadError('Please choose a transparent PNG file.')
      return
    }
    setReplacingId(id)
    setUploadError(null)
    try {
      const storageId = await uploadFileToStorage(file)
      await replaceImage({ sessionToken, id, storageId })
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to replace image')
    } finally {
      setReplacingId(null)
      replaceTargetRef.current = null
    }
  }

  async function saveName(id: Id<'placements'>) {
    const name = nameDraft.trim()
    const current = order.find(p => p._id === id)
    setEditing(null)
    if (current && name && name !== current.name) {
      await renameItem({ sessionToken, id, name })
    }
  }

  async function persistOrder(next: LogoItem[]) {
    setOrder(next)
    await reorderItems({ sessionToken, orderedIds: next.map(p => p._id) })
  }

  function handleDrop(dropIndex: number) {
    const from = dragIndex
    setDragIndex(null)
    setDragOverIndex(null)
    if (from === null || from === dropIndex) return
    const next = [...order]
    const [moved] = next.splice(from, 1)
    next.splice(dropIndex, 0, moved)
    void persistOrder(next)
  }

  return (
    <div>
      <p style={{ fontFamily: SERIF, fontSize: 28, color: TEXT, margin: '0 0 8px 0' }}>
        {heading} <span style={{ fontSize: 16, color: '#9CA3AF', fontFamily: 'sans-serif' }}>({order.length})</span>
      </p>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px 0', lineHeight: 1.6 }}>{blurb}</p>

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) void handleReplace(f) }}
      />

      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '24px', marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Name (optional)</label>
            <input value={logoName} onChange={e => setLogoName(e.target.value)} style={inputStyle} placeholder="e.g. Goldman Sachs" />
          </div>
          <div>
            <label style={labelStyle}>Logo file (transparent PNG)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              disabled={uploading}
              onChange={e => { const f = e.target.files?.[0]; if (f) void handleUpload(f) }}
              style={{ ...inputStyle, padding: '8px 12px', cursor: uploading ? 'not-allowed' : 'pointer' }}
            />
          </div>
        </div>
        {uploading && <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Uploading…</p>}
        {uploadError && <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{uploadError}</p>}
        {!uploading && !uploadError && <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Choosing a file uploads it immediately.</p>}
      </div>

      {order.length === 0 && (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 15 }}>No logos yet. Upload a PNG above to add one.</div>
      )}
      {order.length > 1 && (
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 12px 0' }}>Drag a card by its image to reorder how logos appear. Click the image to replace it, or the name to rename it.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {order.map((p, i) => {
          const isDragging = dragIndex === i
          const isDragOver = dragOverIndex === i && dragIndex !== null && dragIndex !== i
          return (
          <div
            key={p._id}
            onDragOver={e => { if (dragIndex !== null) { e.preventDefault(); setDragOverIndex(i) } }}
            onDrop={e => { e.preventDefault(); handleDrop(i) }}
            style={{
              backgroundColor: '#fff',
              border: isDragOver ? `2px dashed ${ACCENT}` : '1px solid rgba(0,0,0,0.08)',
              padding: isDragOver ? 15 : 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              opacity: isDragging ? 0.4 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            <div
              draggable
              onDragStart={() => { setDragIndex(i); setDragOverIndex(i) }}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null) }}
              onClick={() => { if (replacingId !== p._id) pickReplacement(p._id) }}
              title="Drag to reorder · Click to replace image"
              style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B5470, #3E8DAA)', borderRadius: 6, position: 'relative', cursor: 'grab' }}
            >
              {p.url && <img src={p.url} alt={p.name} draggable={false} style={{ maxHeight: 44, maxWidth: '80%', objectFit: 'contain', opacity: replacingId === p._id ? 0.3 : 1 }} />}
              <span style={{ position: 'absolute', top: 6, left: 8, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>#{i + 1}</span>
              <span style={{ position: 'absolute', top: 6, right: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1 }}>⠿</span>
              {replacingId === p._id && (
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 600 }}>Replacing…</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {editing === p._id ? (
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={e => setNameDraft(e.target.value)}
                  onBlur={() => void saveName(p._id)}
                  onKeyDown={e => { if (e.key === 'Enter') void saveName(p._id); if (e.key === 'Escape') setEditing(null) }}
                  style={{ flex: 1, minWidth: 0, fontSize: 13, padding: '3px 6px', border: `1px solid ${ACCENT}`, outline: 'none', boxSizing: 'border-box' }}
                />
              ) : (
                <p
                  onClick={() => { setEditing(p._id); setNameDraft(p.name) }}
                  title="Click to rename"
                  style={{ flex: 1, fontSize: 13, color: p.name ? TEXT : '#9CA3AF', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
                >{p.name || 'Unnamed — click to rename'}</p>
              )}
              <button
                onClick={() => pickReplacement(p._id)}
                disabled={replacingId === p._id}
                title="Replace image"
                style={{ padding: '2px 8px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', color: TEXT, fontSize: 12, cursor: replacingId === p._id ? 'not-allowed' : 'pointer', borderRadius: 3, lineHeight: 1.4, whiteSpace: 'nowrap' }}
              >Replace</button>
            </div>
            {deleteConfirm === p._id ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={async () => { await removeItem({ id: p._id, sessionToken }); setDeleteConfirm(null) }} style={{ flex: 1, padding: '6px 0', backgroundColor: '#EF4444', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer' }}>Confirm</button>
                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '6px 0', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setDeleteConfirm(p._id)} style={{ padding: '6px 0', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>Delete</button>
            )}
          </div>
          )
        })}
      </div>
    </div>
  )
}
