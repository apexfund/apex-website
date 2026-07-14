import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import LogoManager from '../components/LogoManager'
import TeamManager from '../components/TeamManager'

const SESSION_KEY = 'apexAdminToken'

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
  images?: Id<'_storage'>[]
}

const emptyForm = {
  title: '',
  date: new Date().toISOString().slice(0, 10),
  category: '',
  description: '',
  content: '',
  slug: '',
  images: [] as Id<'_storage'>[],
}

export default function Admin() {
  // Restore session from localStorage on mount
  const [sessionToken, setSessionToken] = useState<string | null>(
    () => localStorage.getItem(SESSION_KEY)
  )
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<Id<'articles'> | null>(null)
  const [tab, setTab] = useState<'list' | 'write' | 'placements' | 'sponsors' | 'team'>('list')
  const [deleteConfirm, setDeleteConfirm] = useState<Id<'articles'> | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [imgUploading, setImgUploading] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Always call hooks at top level
  const isSessionValid = useQuery(
    api.adminAuth.validateSession,
    sessionToken ? { token: sessionToken } : 'skip'
  )

  const articles: ArticleDoc[] = useQuery(api.articles.list) ?? []
  const loginMutation = useMutation(api.adminAuth.adminLogin)
  const logoutMutation = useMutation(api.adminAuth.adminLogout)
  const createArticle = useMutation(api.articles.create)
  const updateArticle = useMutation(api.articles.update)
  const removeArticle = useMutation(api.articles.remove)
  const generateImageUploadUrl = useMutation(api.articles.generateUploadUrl)
  const getImageUrl = useMutation(api.articles.getImageUrl)

  // Derive auth state: we have a token AND the server says it's valid
  // isSessionValid === undefined means still loading; treat as authed optimistically
  const authed = !!sessionToken && isSessionValid !== false

  async function handleLogin() {
    setLoginLoading(true)
    setPwError(false)
    try {
      const token = await loginMutation({ password: pw })
      if (token) {
        localStorage.setItem(SESSION_KEY, token)
        setSessionToken(token)
        setPw('')
      } else {
        setPwError(true)
      }
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleLogout() {
    if (sessionToken) {
      await logoutMutation({ token: sessionToken })
    }
    localStorage.removeItem(SESSION_KEY)
    setSessionToken(null)
    setTab('list')
    setEditing(null)
    setForm(emptyForm)
  }

  function startEdit(a: ArticleDoc) {
    setForm({ title: a.title, date: a.date, category: a.category ?? '', description: a.description ?? '', content: a.content, slug: a.slug, images: a.images ?? [] })
    setEditing(a._id)
    setTab('write')
    setSaveError(null)
  }

  function insertIntoContent(snippet: string) {
    const el = contentRef.current
    setForm(f => {
      const start = el?.selectionStart ?? f.content.length
      const end = el?.selectionEnd ?? f.content.length
      const before = f.content.slice(0, start)
      const after = f.content.slice(end)
      const lead = before === '' || before.endsWith('\n') ? '' : '\n'
      const insert = `${lead}${snippet}\n`
      const nextContent = before + insert + after
      requestAnimationFrame(() => {
        if (el) {
          const caret = before.length + insert.length
          el.focus()
          el.setSelectionRange(caret, caret)
        }
      })
      return { ...f, content: nextContent }
    })
  }

  async function handleInsertImage(file: File) {
    if (!sessionToken) return
    if (!file.type.startsWith('image/')) {
      setSaveError('Please choose an image file.')
      return
    }
    setImgUploading(true)
    setSaveError(null)
    try {
      const postUrl = await generateImageUploadUrl({ sessionToken })
      const res = await fetch(postUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
      if (!res.ok) throw new Error('Image upload failed')
      const { storageId } = await res.json()
      const url = await getImageUrl({ sessionToken, storageId })
      if (!url) throw new Error('Could not resolve image URL')
      const alt = file.name.replace(/\.[^.]+$/, '')
      insertIntoContent(`![${alt}](${url})`)
      setForm(f => ({ ...f, images: [...f.images, storageId as Id<'_storage'>] }))
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setImgUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  function resetForm() {
    setForm(emptyForm)
    setEditing(null)
    setTab('list')
    setSaveError(null)
  }

  async function handleSubmit() {
    if (!form.title || !form.date || !form.content || !sessionToken) return
    setSaveError(null)
    const slug = form.slug || slugify(form.title)
    const payload = {
      sessionToken,
      title: form.title,
      date: form.date,
      slug,
      content: form.content,
      images: form.images,
      ...(form.category ? { category: form.category } : {}),
      ...(form.description ? { description: form.description } : {}),
    }
    try {
      if (editing) {
        await updateArticle({ id: editing, ...payload })
      } else {
        await createArticle(payload)
      }
      resetForm()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save article')
    }
  }

  // ── Login screen ──────────────────────────────────────────────────────────
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
            onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
            style={{ width: '100%', padding: '10px 12px', border: `1px solid ${pwError ? '#EF4444' : 'rgba(0,0,0,0.12)'}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
          />
          {pwError && <p style={{ fontSize: 12, color: '#EF4444', margin: '0 0 12px 0' }}>Incorrect password.</p>}
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            style={{ width: '100%', padding: '11px', backgroundColor: TEXT, color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: loginLoading ? 'not-allowed' : 'pointer', opacity: loginLoading ? 0.7 : 1 }}
          >
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, color: '#6B7280', fontSize: 13, textDecoration: 'none' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = TEXT }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#6B7280' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // ── Admin UI ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Top bar */}
      <div style={{ backgroundColor: TEXT, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <span style={{ fontFamily: SERIF, color: '#DCF0F8', fontSize: 18 }}>Apex Admin</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <button onClick={() => { setTab('list'); setEditing(null); setForm(emptyForm) }} style={{ background: 'none', border: 'none', color: tab === 'list' ? '#fff' : 'rgba(220,240,250,0.5)', fontSize: 13, cursor: 'pointer', fontWeight: tab === 'list' ? 600 : 400 }}>Articles</button>
          <button onClick={() => { setTab('placements'); setEditing(null); setForm(emptyForm) }} style={{ background: 'none', border: 'none', color: tab === 'placements' ? '#fff' : 'rgba(220,240,250,0.5)', fontSize: 13, cursor: 'pointer', fontWeight: tab === 'placements' ? 600 : 400 }}>Placements</button>
          <button onClick={() => { setTab('sponsors'); setEditing(null); setForm(emptyForm) }} style={{ background: 'none', border: 'none', color: tab === 'sponsors' ? '#fff' : 'rgba(220,240,250,0.5)', fontSize: 13, cursor: 'pointer', fontWeight: tab === 'sponsors' ? 600 : 400 }}>Sponsors</button>
          <button onClick={() => { setTab('team'); setEditing(null); setForm(emptyForm) }} style={{ background: 'none', border: 'none', color: tab === 'team' ? '#fff' : 'rgba(220,240,250,0.5)', fontSize: 13, cursor: 'pointer', fontWeight: tab === 'team' ? 600 : 400 }}>Team</button>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(220,240,250,0.6)', fontSize: 12, cursor: 'pointer', padding: '4px 12px', borderRadius: 2 }}
          >
            Log out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>

        {/* Article list */}
        {tab === 'list' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, margin: '0 0 32px 0' }}>
              <p style={{ fontFamily: SERIF, fontSize: 28, color: TEXT, margin: 0 }}>Articles <span style={{ fontSize: 16, color: '#9CA3AF', fontFamily: 'sans-serif' }}>({articles.length})</span></p>
              <button
                onClick={() => { setTab('write'); setEditing(null); setForm(emptyForm) }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', backgroundColor: TEXT, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
              >
                + New Article
              </button>
            </div>
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
                      <button onClick={async () => { await removeArticle({ id: a._id, sessionToken: sessionToken! }); setDeleteConfirm(null) }} style={{ padding: '6px 16px', backgroundColor: '#EF4444', border: 'none', color: '#fff', fontSize: 13, cursor: 'pointer' }}>Confirm</button>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Content (Markdown) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {imgUploading && <span style={{ fontSize: 12, color: '#6B7280' }}>Uploading…</span>}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) void handleInsertImage(f) }}
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={imgUploading}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: `1px solid ${ACCENT}`, backgroundColor: 'transparent', color: TEXT, fontSize: 12, fontWeight: 600, cursor: imgUploading ? 'not-allowed' : 'pointer', borderRadius: 3 }}
                    >
                      + Insert image
                    </button>
                  </div>
                </div>
                <textarea
                  ref={contentRef}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  style={{ ...inputStyle, height: 380, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}
                  placeholder="Write your article in Markdown..."
                />
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '6px 0 0 0' }}>
                  Click “Insert image” to upload a photo — it’s added as markdown (<code>![alt](url)</code>) at your cursor. You can also resize it with HTML, e.g. <code>&lt;img src="url" width="400" /&gt;</code>.
                </p>
              </div>
              {saveError && (
                <p style={{ fontSize: 13, color: '#EF4444', margin: 0 }}>{saveError}</p>
              )}
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

        {/* Placements — company logos */}
        {tab === 'placements' && (
          <LogoManager
            sessionToken={sessionToken!}
            apiModule={api.placements}
            heading="Placements"
            blurb="Upload transparent PNG company logos. They appear in the Member Placements section on the home page."
          />
        )}

        {/* Sponsors — partner logos */}
        {tab === 'sponsors' && (
          <LogoManager
            sessionToken={sessionToken!}
            apiModule={api.sponsors as unknown as typeof api.placements}
            heading="Sponsors"
            blurb="Upload transparent PNG sponsor logos. They appear in the Sponsorships section on the home page."
          />
        )}

        {/* Team — member roster */}
        {tab === 'team' && (
          <TeamManager sessionToken={sessionToken!} />
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
