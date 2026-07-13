import { useRef, useState } from 'react'
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

/**
 * Admin UI for managing a collection of logos (upload, rename, reorder,
 * delete). Works for any Convex module that exposes the same function shape
 * (placements, sponsors, …); pass that module via `apiModule`.
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
  const items = useQuery(apiModule.list) ?? []
  const generateUploadUrl = useMutation(apiModule.generateUploadUrl)
  const createItem = useMutation(apiModule.create)
  const removeItem = useMutation(apiModule.remove)
  const reorderItems = useMutation(apiModule.reorder)
  const renameItem = useMutation(apiModule.rename)

  const [logoName, setLogoName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Id<'placements'> | null>(null)
  const [editing, setEditing] = useState<Id<'placements'> | null>(null)
  const [nameDraft, setNameDraft] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    if (file.type !== 'image/png') {
      setUploadError('Please choose a transparent PNG file.')
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const postUrl = await generateUploadUrl({ sessionToken })
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!res.ok) throw new Error('Upload failed')
      const { storageId } = await res.json()
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

  async function saveName(id: Id<'placements'>) {
    const name = nameDraft.trim()
    const current = items.find(p => p._id === id)
    setEditing(null)
    if (current && name && name !== current.name) {
      await renameItem({ sessionToken, id, name })
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const ordered = [...items]
    const tmp = ordered[index]
    ordered[index] = ordered[target]
    ordered[target] = tmp
    await reorderItems({ sessionToken, orderedIds: ordered.map(p => p._id) })
  }

  return (
    <div>
      <p style={{ fontFamily: SERIF, fontSize: 28, color: TEXT, margin: '0 0 8px 0' }}>
        {heading} <span style={{ fontSize: 16, color: '#9CA3AF', fontFamily: 'sans-serif' }}>({items.length})</span>
      </p>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px 0', lineHeight: 1.6 }}>{blurb}</p>

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

      {items.length === 0 && (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 15 }}>No logos yet. Upload a PNG above to add one.</div>
      )}
      {items.length > 1 && (
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 12px 0' }}>Use the arrows to reorder how logos appear on the home page.</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {items.map((p, i) => (
          <div key={p._id} style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B5470, #3E8DAA)', borderRadius: 6, position: 'relative' }}>
              {p.url && <img src={p.url} alt={p.name} style={{ maxHeight: 44, maxWidth: '80%', objectFit: 'contain' }} />}
              <span style={{ position: 'absolute', top: 6, left: 8, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>#{i + 1}</span>
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
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Move earlier"
                style={{ padding: '2px 8px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', color: i === 0 ? '#D1D5DB' : TEXT, fontSize: 13, cursor: i === 0 ? 'not-allowed' : 'pointer', borderRadius: 3, lineHeight: 1.4 }}
              >↑</button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Move later"
                style={{ padding: '2px 8px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', color: i === items.length - 1 ? '#D1D5DB' : TEXT, fontSize: 13, cursor: i === items.length - 1 ? 'not-allowed' : 'pointer', borderRadius: 3, lineHeight: 1.4 }}
              >↓</button>
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
        ))}
      </div>
    </div>
  )
}
