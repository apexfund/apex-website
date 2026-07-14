// One-off backfill: import the hardcoded team roster into Convex `teamMembers`,
// uploading each member photo to Convex storage.
//
// Usage (PowerShell):
//   node scripts/seedTeam.mjs "<admin-password>"
//
// The Convex URL defaults to the dev deployment; override with CONVEX_URL.
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../convex/_generated/api.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MEMBERS_DIR = join(__dirname, '..', 'src', 'assets', 'members')

const CONVEX_URL = process.env.CONVEX_URL || 'https://grand-vulture-41.convex.cloud'
const PASSWORD = process.argv[2] || process.env.ADMIN_PASSWORD
if (!PASSWORD) {
  console.error('Missing admin password. Run: node scripts/seedTeam.mjs "<password>"')
  process.exit(1)
}

const QUANT = 'Quantitative Team'
const FUND = 'Fundamental Team'

// [name, role, team, execBoard, image filename | null, linkedIn | '']
const MEMBERS = [
  ['Vishesh Gupta', 'Senior Analyst', QUANT, true, 'vishesh_gupta.jpeg', 'https://www.linkedin.com/in/visheshng/'],
  ['Kushal Kapoor', 'Advisor', QUANT, true, 'kushal_kapoor.jpeg', 'https://www.linkedin.com/in/kushalkapoor25/'],
  ['Caleb Chang', 'Analyst', QUANT, false, 'caleb_chang.jpeg', 'https://www.linkedin.com/in/cchang22/'],
  ['Daniel Wang', 'Analyst', QUANT, false, 'daniel_wang.jpeg', 'https://www.linkedin.com/in/daniel-e-wang/'],
  ['Edward Song', 'Analyst', QUANT, false, 'edward_song.jpeg', 'https://www.linkedin.com/in/edwardrsong/'],
  ['Krishi Cherukupalli', 'Senior Analyst', QUANT, true, 'krishi_cherukupalli.jpeg', 'https://www.linkedin.com/in/krishi-cherukupalli/'],
  ['Narain Sriam', 'Analyst', QUANT, false, 'narain_sriram.jpeg', 'https://www.linkedin.com/in/narainsriram/'],
  ['Pranav Bykampadi', 'Analyst', QUANT, false, 'pranav_bykampadi.jpeg', 'https://www.linkedin.com/in/pranav-bykampadi-b89162262/'],
  ['Shivam Amin', 'Analyst', QUANT, false, 'shivam_amin.jpeg', 'https://www.linkedin.com/in/shivamamin05/'],
  ['Eshan Khan', 'Analyst', QUANT, false, 'eshan_khan.jpeg', 'https://www.linkedin.com/in/eshankhan05/'],
  ['Varun Rao', 'Analyst', QUANT, false, 'varun_rao.jpeg', 'https://www.linkedin.com/in/varunvrao/'],
  ['Viraj Urs', 'Analyst', QUANT, false, 'viraj_urs.jpeg', 'https://www.linkedin.com/in/viraj-urs/'],
  ['Aarush Vinod', 'Analyst', QUANT, false, null, ''],
  ['Curtis Lu', 'Analyst', QUANT, false, null, 'https://www.linkedin.com/in/curtis-h-lu/'],
  ['Aastha Doshi', 'Analyst', QUANT, false, null, ''],
  ['Agastya Choudhary', 'Analyst', QUANT, false, null, ''],
  ['Anish Maheshwar', 'Analyst', QUANT, false, null, ''],
  ['Anish Parikh', 'Analyst', QUANT, false, null, ''],
  ['Anya Goel', 'Analyst', QUANT, false, null, ''],
  ['Dhruv Dhananjay', 'Analyst', QUANT, false, null, ''],
  ['Eric Huang', 'Analyst', QUANT, false, null, ''],
  ['Felix Ozpaker', 'Analyst', QUANT, false, null, ''],
  ['Hashem Alomar', 'Analyst', QUANT, false, null, ''],
  ['Oliver Andrews', 'Analyst', QUANT, false, null, ''],
  ['Owen Marzolf-Miller', 'Analyst', QUANT, false, null, ''],
  ['Rohan Chintakindi', 'Analyst', QUANT, false, null, ''],
  ['Theo Williams', 'Analyst', QUANT, false, null, ''],
  ['Vedant Narayan', 'Analyst', QUANT, false, null, ''],
  ['Yudhiishbala Senthilkumar', 'Analyst', QUANT, false, null, ''],
  ['Joseph Asselta', 'Portfolio Manager', FUND, true, 'joseph_asselta.jpeg', 'https://www.linkedin.com/in/josephasselta/'],
  ['Cooper Dorf', 'Portfolio Manager', FUND, true, 'cooper_dorf.jpeg', 'https://www.linkedin.com/in/cooper-dorf/'],
  ['Alex Lavitz', 'Analyst', FUND, false, 'alex_lavitz.jpeg', 'https://www.linkedin.com/in/alexlavitz/'],
  ['Ali Shah', 'Analyst', FUND, false, 'ali_shah.jpeg', 'https://www.linkedin.com/in/ali-hadi-shah/'],
  ['Emilio Gallo', 'Analyst', FUND, false, 'emilio_gallo.jpeg', 'https://www.linkedin.com/in/emiliogallo/'],
  ['Gage Hamilton', 'Analyst', FUND, false, 'gage_hamilton.jpeg', 'https://www.linkedin.com/in/gage-hamilton-aa8718284/'],
  ['Isaac Kushnir', 'Analyst', FUND, false, 'isaac_kushnir.jpeg', 'https://www.linkedin.com/in/isaac-kushnir/'],
  ['Kevin Bowles', 'Analyst', FUND, false, 'kevin_bowles.jpeg', 'https://www.linkedin.com/in/kevin-bowles-8239a9321/'],
  ['Leo Paradise', 'Analyst', FUND, false, 'leo_paradise.jpeg', 'https://www.linkedin.com/in/leo-paradise-23b282328/'],
  ['Marty Linsky', 'Analyst', FUND, false, 'martin_linsky.jpeg', 'https://www.linkedin.com/in/martin-linsky/'],
  ['Matthew Vacek', 'Analyst', FUND, false, 'matthew_vacek.jpeg', 'https://www.linkedin.com/in/matthew-c-vacek/'],
  ['Michael Luther', 'Analyst', FUND, false, 'michael_luterh.jpeg', 'https://www.linkedin.com/in/michael-a-luther/'],
  ['Patrick Eskildsen', 'Analyst', FUND, false, 'patrick_eskildsen.jpeg', 'https://www.linkedin.com/in/patrick-eskildsen/'],
  ['Reed Plotnick', 'Analyst', FUND, false, 'reed_plotnick.jpeg', 'https://www.linkedin.com/in/reedplotnick/'],
  ['Saketh Ram Kannoju', 'Analyst', FUND, false, 'saketh_ram_kannuoju.jpeg', 'https://www.linkedin.com/in/sakethkannoju/'],
  ['Tyson Nguyen', 'Analyst', FUND, false, 'tyson_nguyen.jpeg', 'https://www.linkedin.com/in/tyson-nguyen-b40920233/'],
  ['Boburkhan Djumanov', 'Analyst', FUND, false, 'boburkhan_djumanov.jpeg', 'https://www.linkedin.com/in/boburkhandjumanov/'],
]

const client = new ConvexHttpClient(CONVEX_URL)

async function main() {
  console.log(`Connecting to ${CONVEX_URL}`)
  const token = await client.mutation(api.adminAuth.adminLogin, { password: PASSWORD })
  if (!token) {
    console.error('Login failed — check the admin password.')
    process.exit(1)
  }
  console.log('Authenticated.')

  // Clear any existing team members so re-running stays idempotent.
  const existing = await client.query(api.teamMembers.list, {})
  if (existing.length) {
    console.log(`Clearing ${existing.length} existing member(s)…`)
    for (const m of existing) {
      await client.mutation(api.teamMembers.remove, { sessionToken: token, id: m._id })
    }
  }

  let created = 0
  for (const [name, role, team, execBoard, image, linkedIn] of MEMBERS) {
    let storageId
    if (image) {
      const filePath = join(MEMBERS_DIR, image)
      if (!existsSync(filePath)) {
        console.warn(`  ! photo not found for ${name}: ${image} (skipping photo)`)
      } else {
        const bytes = readFileSync(filePath)
        const postUrl = await client.mutation(api.teamMembers.generateUploadUrl, { sessionToken: token })
        const res = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'image/jpeg' },
          body: bytes,
        })
        if (!res.ok) throw new Error(`Upload failed for ${name}: ${res.status}`)
        const json = await res.json()
        storageId = json.storageId
      }
    }
    await client.mutation(api.teamMembers.create, {
      sessionToken: token,
      name,
      role,
      team,
      execBoard: execBoard || undefined,
      linkedIn: linkedIn || undefined,
      storageId,
    })
    created++
    console.log(`  + ${name}${storageId ? ' (photo)' : ''}`)
  }

  console.log(`\nDone. Created ${created} team members.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
