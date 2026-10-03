#!/usr/bin/env node
// One-time: shrink oversized team photos in Convex storage to cut data egress.
//
//   node scripts/shrink-team-photos.mjs                 # dry run (read-only)
//   CONVEX_DEPLOY_KEY='prod:...' node scripts/shrink-team-photos.mjs --apply
//
// For each team photo over THRESHOLD_BYTES: back up the original locally,
// resize with macOS `sips`, upload the result, repoint the row, and delete
// the old stored file. Needs maintenance.ts deployed to the target deployment.
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync, statSync, existsSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const SITE_QUERY_URL = process.env.CONVEX_QUERY_URL ?? 'https://elated-goat-383.convex.cloud/api/query'
const MAX_DIMENSION = 320
const THRESHOLD_BYTES = 250 * 1024
const BACKUP_DIR = join(homedir(), 'apex-team-photos-backup')
const apply = process.argv.includes('--apply')

const mb = n => (n / 1e6).toFixed(2) + ' MB'

const res = await fetch(SITE_QUERY_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ path: 'teamMembers:list', args: {}, format: 'json' }),
})
const members = (await res.json()).value.filter(m => m.storageId && m.url)

if (apply) mkdirSync(BACKUP_DIR, { recursive: true })
const work = join(tmpdir(), 'apex-shrink'); mkdirSync(work, { recursive: true })

let before = 0, after = 0, changed = 0
for (const m of members) {
  const orig = Buffer.from(await (await fetch(m.url)).arrayBuffer())
  before += orig.length
  if (orig.length <= THRESHOLD_BYTES) { after += orig.length; continue }

  const type = (await fetch(m.url, { method: 'HEAD' })).headers.get('content-type') ?? ''
  const isPng = type === 'image/png'
  const ext = isPng ? 'png' : 'jpg'
  const src = join(work, `${m.storageId}.src`)
  const out = join(work, `${m.storageId}.${ext}`)
  writeFileSync(src, orig)
  execFileSync('sips', [
    '-Z', String(MAX_DIMENSION),
    '-s', 'format', isPng ? 'png' : 'jpeg',
    ...(isPng ? [] : ['-s', 'formatOptions', '85']),
    src, '--out', out,
  ], { stdio: 'ignore' })
  const size = statSync(out).size
  if (size >= orig.length) { after += orig.length; console.log(`skip   ${m.name}: result not smaller`); continue }
  after += size; changed++
  console.log(`${apply ? 'shrink' : 'would '} ${m.name}: ${mb(orig.length)} -> ${mb(size)}`)
  if (!apply) continue

  writeFileSync(join(BACKUP_DIR, `${m._id}-${m.name.replace(/[^\w]+/g, '_')}.${ext === 'png' ? 'png' : 'orig'}`), orig)
  const uploadUrl = JSON.parse(execFileSync('npx', ['convex', 'run', 'maintenance:generateUploadUrl', '{}'], { encoding: 'utf8' }))
  const up = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': isPng ? 'image/png' : 'image/jpeg' }, body: readFileSync(out) })
  if (!up.ok) throw new Error(`upload failed for ${m.name}: ${up.status}`)
  const { storageId } = await up.json()
  execFileSync('npx', ['convex', 'run', 'maintenance:replaceTeamPhoto',
    JSON.stringify({ id: m._id, oldStorageId: m.storageId, newStorageId: storageId })], { stdio: 'ignore' })
}
console.log(`\n${members.length} photos, ${changed} ${apply ? 'shrunk' : 'would shrink'}: ${mb(before)} -> ${mb(after)}`)
if (apply) console.log(`Originals backed up in ${BACKUP_DIR}`)
