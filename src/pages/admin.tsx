import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

const ADMIN_PASSWORD = 'apexfund2025'

const SERIF = 'Georgia, serif'
const TEXT = '#0C1929'
const ACCENT = '#96BFCF'

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type ArticleDoc = {
  _id: Id<'articles'>
  title: string
  date: string
  category?: string
  description?: string
  content: string
  slug: string
}

const emptyForm = { title: '', date: new Date().toISOString().slice(0, 10), category: '', description: '', content: '', slug: '' }

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<Id<'articles'> | null>(null)
  const [tab, setTab] = useState<'list' | 'write'>('list')
  const [deleteConfirm, setDeleteConfirm] = useState<Id<'articles'> | null>(null)

  const articles = useQuery(api.articles.list) ?? []
  const createArticle = useMutation(api.articles.create)
  const updateArticle = useMutation(api.articles.update)
  const removeArticle = useMutation(api.articles.remove)

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA' }}>
        <div style={{ width: 360, padding: '48px 40px', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
          <p style={{ fontFamily: SERIF, fontSize: 24, color: TEXT, margin: '0 0 8px 0' }}>Admin</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 28px 0' }}>Apex Fund — Content Management</p>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError(false) }}
            onKeyDown={e => { if (e.key === 'Enter') { if (pw === ADMIN_PASSWORD) setAuthed(true); else setPwError(true) } }}
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${pwError ? '#EF4444' : 'rgba(0,0,0,0.12)'}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
          />
          {pwError && <p style={{ fontSize: 12, color: '#EF4444', margin: '0 0 12px 0' }}>Incorrect password.</p>}
          <button
            onClick={() => { if (pw === ADMIN_PASSWORD) setAuthed(true); else setPwError(true) }}
            style={{ width: '100%', padding: '11px', backgroundColor: TEXT, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  function startEdit(a: ArticleDoc) {
    setForm({ title: a.title, date: a.date, category: a.category ?? '', description: a.description ?? '', content: a.content, slug: a.slug })
    setEditing(a._id)
    setTab('write')
  }

  function resetForm() {
    setForm(emptyForm)
    setEditing(null)
    setTab('list')
  }

  async function handleSubmit() {
    if (!form.title || !form.date || !form.content) return
    const slug = form.slug || slugify(form.title)
    const payload = { ...form, slug, category: form.category || undefined, description: form.description || undefined }
    if (editing) {
      await updateArticle({ id: editing, ...payload })
    } else {
      await createArticle(payload)
    }
    resetForm()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontFamily: SERIF, color: '#DCF0F8', fontSize: 18 }}>Apex Admin</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => { setTab('list'); setEditing(null); setForm(emptyForm) }} style={{ background: 'none', border: 'none', color: tab === 'list' ? '#fff' : 'rgba(220,240,250,0.5)', fontSize: 13, cursor: 'pointer', fontWeight: tab === 'list' ? 600 : 400 }}>Articles</button>
          <button onClick={() => { setTab('write'); setEditing(null); setForm(emptyForm) }} style={{ background: 'none', border: 'none', color: tab === 'write' ? '#fff' : 'rgba(220,240,250,0.5)', fontSize: 13, cursor: 'pointer', fontWeight: tab === 'write' ? 600 : 400 }}>+ New Article</button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>

        {/* Article list */}
        {tab === 'list' && (
          <div>
            <p style={{ fontFamily: SERIF, fontSize: 28, color: TEXT, margin: '0 0 32px 0' }}>Articles <span style={{ fontSize: 16, color: '#9CA3AF', fontFamily: 'sans-serif' }}>({articles.length})</span></p>
            {articles.length === 0 && (
              <div style={{ padding: '48px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 15 }}>No articles yet. Click "+ New Article" to add one.</div>
            )}
            {articles.map(a => (
              <div key={a._id} style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '20px 24px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: SERIF, fontSize: 17, color: TEXT, margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{a.date}{a.category ? ` · ${a.category}` : ''}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => startEdit(a)} style={{ padding: '6px 16px', border: `1px solid ${ACCENT}`, backgroundColor: 'transparent', color: TEXT, fontSize: 13, cursor: 'pointer' }}>Edit</button>
                  {deleteConfirm === a._id ? (
                    <>
                      <button onClick={async () => { await removeArticle({ id: a._id }); setDeleteConfirm(null) }} style={{ padding: '6px 16px', backgroundColor: '#EF4444', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer' }}>Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '6px 12px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteConfirm(a._id)} style={{ padding: '6px 16px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write / Edit form */}
        {tab === 'write' && (
          <div>
            <p style={{ fontFamily: SERIF, fontSize: 28, color: TEXT, margin: '0 0 32px 0' }}>{editing ? 'Edit Article' : 'New Article'}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))} style={inputStyle} placeholder="Article title" />
                </div>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle} placeholder="e.g. Quantitative, Fundamental" />
                </div>
                <div>
                  <label style={labelStyle}>Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} placeholder="auto-generated from title" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={inputStyle} placeholder="Short summary shown on the article list" />
              </div>
              <div>
                <label style={labelStyle}>Content (Markdown) *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  style={{ ...inputStyle, height: 380, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}
                  placeholder="Write your article in Markdown..."
                />
              </div>
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button onClick={handleSubmit} style={{ padding: '11px 32px', backgroundColor: TEXT, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {editing ? 'Save Changes' : 'Publish Article'}
                </button>
                <button onClick={resetForm} style={{ padding: '11px 24px', border: '1px solid rgba(0,0,0,0.12)', backgroundColor: 'transparent', fontSize: 14, cursor: 'pointer', color: '#6B7280' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: '#9CA3AF',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.12)',
  fontSize: 14, outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff',
}
