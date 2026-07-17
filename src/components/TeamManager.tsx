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

const TEAM_OPTIONS = ['Quantitative Team', 'Fundamental Team']

/** Ensures a URL is absolute so it isn't treated as a same-origin path. */
function normalizeUrl(url: string): string | undefined {
  const trimmed = url.trim()
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, '')}`
}

const emptyForm = { name: '', role: '', team: '', execBoard: false, linkedIn: '' }

/**
 * Admin UI for managing team members (photo, name, role, LinkedIn). Members are
 * always displayed alphabetically on the public site, so there is no manual
 * ordering here.
 */
export default function TeamManager({ sessionToken }: { sessionToken: string }) {
  const members = useQuery(api.teamMembers.list) ?? []
  const generateUploadUrl = useMutation(api.teamMembers.generateUploadUrl)
  const createMember = useMutation(api.teamMembers.create)
  const updateMember = useMutation(api.teamMembers.update)
  const removeMember = useMutation(api.teamMembers.remove)

  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<Id<'teamMembers'> | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Id<'teamMembers'> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function pickFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setError(null)
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditing(null)
    setPendingFile(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function startEdit(m: { _id: Id<'teamMembers'>; name: string; role: string; team: string | null; execBoard: boolean; linkedIn: string | null; url: string | null }) {
    setEditing(m._id)
    setForm({ name: m.name, role: m.role, team: m.team ?? '', execBoard: m.execBoard, linkedIn: m.linkedIn ?? '' })
    setPendingFile(null)
    setPreviewUrl(m.url)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function uploadPhoto(file: File): Promise<Id<'_storage'>> {
    const postUrl = await generateUploadUrl({ sessionToken })
    const res = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    })
    if (!res.ok) throw new Error('Photo upload failed')
    const { storageId } = await res.json()
    return storageId as Id<'_storage'>
  }

  async function handleSubmit() {
    const name = form.name.trim()
    const role = form.role.trim()
    if (!name || !role) {
      setError('Name and role are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const storageId = pendingFile ? await uploadPhoto(pendingFile) : undefined
      const linkedIn = normalizeUrl(form.linkedIn)
      const team = form.team.trim() || undefined
      const execBoard = form.execBoard || undefined
      if (editing) {
        await updateMember({ sessionToken, id: editing, name, role, team, execBoard, linkedIn, storageId })
      } else {
        await createMember({ sessionToken, name, role, team, execBoard, linkedIn, storageId })
      }
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save team member')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p style={{ fontFamily: SERIF, fontSize: 28, color: TEXT, margin: '0 0 8px 0' }}>
        Team <span style={{ fontSize: 16, color: '#9CA3AF', fontFamily: 'sans-serif' }}>({members.length})</span>
      </p>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px 0', lineHeight: 1.6 }}>
        Add members with a photo, name, role, and LinkedIn. They appear on the Meet the Team page, automatically sorted alphabetically.
      </p>

      {/* Add / edit form */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: 24, marginBottom: 32 }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, color: TEXT, margin: '0 0 20px 0' }}>{editing ? 'Edit member' : 'Add a member'}</p>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Photo picker */}
          <div style={{ textAlign: 'center' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              title="Click to choose a photo"
              style={{ width: 104, height: 104, borderRadius: '50%', backgroundColor: '#D6E8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 12, color: '#4A8FAA', fontWeight: 600 }}>Add photo</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f) }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ marginTop: 10, background: 'none', border: 'none', color: ACCENT, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
            >{previewUrl ? 'Change photo' : 'Upload photo'}</button>
          </div>

          {/* Fields */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label style={labelStyle}>Role *</label>
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} placeholder="e.g. Analyst" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Team</label>
                <select value={form.team} onChange={e => setForm(f => ({ ...f, team: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">— None —</option>
                  {TEAM_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: TEXT, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.execBoard} onChange={e => setForm(f => ({ ...f, execBoard: e.target.checked }))} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  Executive Board member
                </label>
              </div>
            </div>
            <div>
              <label style={labelStyle}>LinkedIn URL</label>
              <input value={form.linkedIn} onChange={e => setForm(f => ({ ...f, linkedIn: e.target.value }))} style={inputStyle} placeholder="https://www.linkedin.com/in/…" />
            </div>
            {error && <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{ padding: '11px 28px', backgroundColor: TEXT, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
              >{saving ? 'Saving…' : editing ? 'Save changes' : 'Add member'}</button>
              {editing && (
                <button onClick={resetForm} style={{ padding: '11px 20px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', fontSize: 14, cursor: 'pointer', color: '#6B7280' }}>Cancel</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Member list */}
      {members.length === 0 && (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 15 }}>No team members yet. Add one above.</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {members.map(m => (
          <div key={m._id} style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
            {m.url ? (
              <img src={m.url} alt={m.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#D6E8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600, color: '#4A8FAA', fontFamily: SERIF }}>{m.name.charAt(0).toUpperCase()}</div>
            )}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, margin: '0 0 2px 0' }}>{m.name}</p>
              <p style={{ fontSize: 12, color: ACCENT, fontWeight: 500, margin: 0 }}>{m.role}</p>
              {(m.team || m.execBoard) && (
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0 0' }}>
                  {m.execBoard ? 'Executive Board' : m.team}
                </p>
              )}
              {m.linkedIn && <a href={normalizeUrl(m.linkedIn)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'none' }}>LinkedIn →</a>}
            </div>
            <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 4 }}>
              <button onClick={() => startEdit(m)} style={{ flex: 1, padding: '6px 0', border: `1px solid ${ACCENT}`, backgroundColor: 'transparent', color: TEXT, fontSize: 13, cursor: 'pointer' }}>Edit</button>
              {deleteConfirm === m._id ? (
                <>
                  <button onClick={async () => { await removeMember({ sessionToken, id: m._id }); setDeleteConfirm(null) }} style={{ flex: 1, padding: '6px 0', backgroundColor: '#EF4444', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer' }}>Confirm</button>
                  <button onClick={() => setDeleteConfirm(null)} style={{ padding: '6px 10px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', fontSize: 13, cursor: 'pointer' }}>×</button>
                </>
              ) : (
                <button onClick={() => setDeleteConfirm(m._id)} style={{ flex: 1, padding: '6px 0', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
