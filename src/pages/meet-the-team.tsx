import Header from '../components/header'
import Footer from '../components/footer'
import MemberCard from '../components/MemberCard'

import vishesh_gupta from '../assets/members/vishesh_gupta.jpeg'
import caleb_chang from '../assets/members/caleb_chang.jpeg'
import daniel_wang from '../assets/members/daniel_wang.jpeg'
import edward_song from '../assets/members/edward_song.jpeg'
import krishi_cherukupalli from '../assets/members/krishi_cherukupalli.jpeg'
import kushal_kapoor from '../assets/members/kushal_kapoor.jpeg'
import narain_sriram from '../assets/members/narain_sriram.jpeg'
import pranav_bykampadi from '../assets/members/pranav_bykampadi.jpeg'
import shivam_amin from '../assets/members/shivam_amin.jpeg'
import eshan_khan from '../assets/members/eshan_khan.jpeg'
import varun_rao from '../assets/members/varun_rao.jpeg'
import viraj_urs from '../assets/members/viraj_urs.jpeg'
import joseph_asselta from '../assets/members/joseph_asselta.jpeg'
import cooper_dorf from '../assets/members/cooper_dorf.jpeg'
import alex_lavitz from '../assets/members/alex_lavitz.jpeg'
import ali_shah from '../assets/members/ali_shah.jpeg'
import emilio_gallo from '../assets/members/emilio_gallo.jpeg'
import gage_hamilton from '../assets/members/gage_hamilton.jpeg'
import isaac_kushnir from '../assets/members/isaac_kushnir.jpeg'
import kevin_bowles from '../assets/members/kevin_bowles.jpeg'
import leo_paradise from '../assets/members/leo_paradise.jpeg'
import martin_linsky from '../assets/members/martin_linsky.jpeg'
import matthew_vacek from '../assets/members/matthew_vacek.jpeg'
import michael_luterh from '../assets/members/michael_luterh.jpeg'
import patrick_eskildsen from '../assets/members/patrick_eskildsen.jpeg'
import reed_plotnick from '../assets/members/reed_plotnick.jpeg'
import saketh_ram_kannuoju from '../assets/members/saketh_ram_kannuoju.jpeg'
import tyson_nguyen from '../assets/members/tyson_nguyen.jpeg'
import boburkhan_djumanov from '../assets/members/boburkhan_djumanov.jpeg'

const HERO_GRADIENT = 'linear-gradient(145deg, #1B5470 0%, #2B7291 30%, #3E8DAA 65%, #6BAABF 100%)'
const ACCENT = '#96BFCF'
const CREAM = '#F1EDEE'
const SERIF = 'Georgia, serif'
const PLUS_BG = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2396bfcf' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

/**
 * Network / node graph graphic.
 * Represents the interconnected team and the community at Apex.
 */
function TeamGraphic() {
  const col = (op: number) => `rgba(255,255,255,${op})`

  // Nodes: [x, y, radius]
  const nodes: [number, number, number][] = [
    [240, 190, 18],   // centre hub
    [148,  98, 11],
    [335,  98, 11],
    [ 88, 220,  8],
    [392, 220,  8],
    [185, 310, 13],   // second hub
    [305, 310, 11],
    [115, 375,  7],
    [240, 405,  7],
    [368, 375,  7],
    [430, 148,  6],
    [ 55, 295,  6],
    [240,  42,  6],
    [165, 450,  6],
    [318, 450,  6],
  ]

  // Edges as pairs of node indices
  const edges: [number, number][] = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,2],[1,3],[1,12],
    [2,4],[2,10],
    [3,5],[3,11],
    [4,6],[4,10],
    [5,6],[5,7],[5,8],
    [6,8],[6,9],
    [7,8],[7,13],
    [8,9],[8,13],
    [9,14],[6,14],
    [11,7],
    [12,2],[12,1],
  ]

  // BFS distances from node 0 (the central hub, r=18)
  // Level 0: [0]
  // Level 1: [1,2,3,4,5,6]   — directly connected to hub
  // Level 2: [7,8,9,10,11,12,14] — one hop further
  // Level 3: [13]             — furthest leaf
  const bfsDist: Record<number, number> = {
    0: 0,
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1,
    7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2, 14: 2,
    13: 3,
  }
  // Map BFS distance → animation start time
  const distToDelay = [0, 0.3, 0.65, 1.0]
  const nodeDelay = (i: number) => distToDelay[bfsDist[i]] ?? 1.0
  // Edges appear once BOTH endpoints are visible (use the later of the two)
  const edgeDelay = (a: number, b: number) =>
    distToDelay[Math.max(bfsDist[a], bfsDist[b])] + 0.08

  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', maxHeight: 460 }}
      aria-hidden
    >
      <defs>
        <style>{`
          @keyframes teamFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes teamNodeIn {
            from { opacity: 0; transform: scale(0); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </defs>

      {/* Edges — appear once both their endpoints are visible */}
      {edges.map(([a, b], i) => {
        const [ax, ay] = nodes[a]
        const [bx, by] = nodes[b]
        return (
          <line key={i}
            x1={ax} y1={ay} x2={bx} y2={by}
            stroke={col(0.11)} strokeWidth="1.2"
            style={{
              opacity: 0,
              animation: `teamFade 0.35s ease ${edgeDelay(a, b)}s forwards`,
            }}
          />
        )
      })}

      {/* Nodes — scale in from their own centre, hub first then outward */}
      {nodes.map(([x, y, r], i) => (
        <g key={i} style={{
          opacity: 0,
          transformOrigin: `${x}px ${y}px`,
          animation: `teamNodeIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${nodeDelay(i)}s forwards`,
        }}>
          <circle cx={x} cy={y} r={r}
            fill={col(0.09)} stroke={col(0.35)} strokeWidth="1.2" />
          {r >= 11 && (
            <circle cx={x} cy={y} r={r * 0.38} fill={col(0.35)} />
          )}
        </g>
      ))}
    </svg>
  )
}

/** Used in the gradient hero */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ color: 'rgba(220,236,244,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
        {children}
      </span>
    </div>
  )
}

/** Used in the body sections */
function AccentLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ color: ACCENT, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
        {children}
      </span>
    </div>
  )
}

const quantitativeMembers = [
  { name: 'Vishesh Gupta', role: 'Senior Analyst', team: 'Quantitative Team', imageUrl: vishesh_gupta, linkedIn: 'https://www.linkedin.com/in/visheshng/' },
  { name: 'Kushal Kapoor', role: 'Advisor', team: 'Quantitative Team', imageUrl: kushal_kapoor, linkedIn: 'https://www.linkedin.com/in/kushalkapoor25/' },
  { name: 'Caleb Chang', role: 'Analyst', team: 'Quantitative Team', imageUrl: caleb_chang, linkedIn: 'https://www.linkedin.com/in/cchang22/' },
  { name: 'Daniel Wang', role: 'Analyst', team: 'Quantitative Team', imageUrl: daniel_wang, linkedIn: 'https://www.linkedin.com/in/daniel-e-wang/' },
  { name: 'Edward Song', role: 'Analyst', team: 'Quantitative Team', imageUrl: edward_song, linkedIn: 'https://www.linkedin.com/in/edwardrsong/' },
  { name: 'Krishi Cherukupalli', role: 'Senior Analyst', team: 'Quantitative Team', imageUrl: krishi_cherukupalli, linkedIn: 'https://www.linkedin.com/in/krishi-cherukupalli/' },
  { name: 'Narain Sriam', role: 'Analyst', team: 'Quantitative Team', imageUrl: narain_sriram, linkedIn: 'https://www.linkedin.com/in/narainsriram/' },
  { name: 'Pranav Bykampadi', role: 'Analyst', team: 'Quantitative Team', imageUrl: pranav_bykampadi, linkedIn: 'https://www.linkedin.com/in/pranav-bykampadi-b89162262/' },
  { name: 'Shivam Amin', role: 'Analyst', team: 'Quantitative Team', imageUrl: shivam_amin, linkedIn: 'https://www.linkedin.com/in/shivamamin05/' },
  { name: 'Eshan Khan', role: 'Analyst', team: 'Quantitative Team', imageUrl: eshan_khan, linkedIn: 'https://www.linkedin.com/in/eshankhan05/' },
  { name: 'Varun Rao', role: 'Analyst', team: 'Quantitative Team', imageUrl: varun_rao, linkedIn: 'https://www.linkedin.com/in/varunvrao/' },
  { name: 'Viraj Urs', role: 'Analyst', team: 'Quantitative Team', imageUrl: viraj_urs, linkedIn: 'https://www.linkedin.com/in/viraj-urs/' },
  { name: 'Aarush Vinod', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Curtis Lu', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: 'https://www.linkedin.com/in/curtis-h-lu/' },
  { name: 'Aastha Doshi', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Agastya Choudhary', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Anish Maheshwar', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Anish Parikh', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Anya Goel', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Dhruv Dhananjay', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Eric Huang', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Felix Ozpaker', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Hashem Alomar', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Oliver Andrews', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Owen Marzolf-Miller', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Rohan Chintakindi', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Theo Williams', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Vedant Narayan', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
  { name: 'Yudhiishbala Senthilkumar', role: 'Analyst', team: 'Quantitative Team', imageUrl: undefined, linkedIn: '' },
]

const fundamentalMembers = [
  { name: 'Joseph Asselta', role: 'Portfolio Manager', team: 'Fundamental Team', imageUrl: joseph_asselta, linkedIn: 'https://www.linkedin.com/in/josephasselta/' },
  { name: 'Cooper Dorf', role: 'Portfolio Manager', team: 'Fundamental Team', imageUrl: cooper_dorf, linkedIn: 'https://www.linkedin.com/in/cooper-dorf/' },
  { name: 'Alex Lavitz', role: 'Analyst', team: 'Fundamental Team', imageUrl: alex_lavitz, linkedIn: 'https://www.linkedin.com/in/alexlavitz/' },
  { name: 'Ali Shah', role: 'Analyst', team: 'Fundamental Team', imageUrl: ali_shah, linkedIn: 'https://www.linkedin.com/in/ali-hadi-shah/' },
  { name: 'Emilio Gallo', role: 'Analyst', team: 'Fundamental Team', imageUrl: emilio_gallo, linkedIn: 'https://www.linkedin.com/in/emiliogallo/' },
  { name: 'Gage Hamilton', role: 'Analyst', team: 'Fundamental Team', imageUrl: gage_hamilton, linkedIn: 'https://www.linkedin.com/in/gage-hamilton-aa8718284/' },
  { name: 'Isaac Kushnir', role: 'Analyst', team: 'Fundamental Team', imageUrl: isaac_kushnir, linkedIn: 'https://www.linkedin.com/in/isaac-kushnir/' },
  { name: 'Kevin Bowles', role: 'Analyst', team: 'Fundamental Team', imageUrl: kevin_bowles, linkedIn: 'https://www.linkedin.com/in/kevin-bowles-8239a9321/' },
  { name: 'Leo Paradise', role: 'Analyst', team: 'Fundamental Team', imageUrl: leo_paradise, linkedIn: 'https://www.linkedin.com/in/leo-paradise-23b282328/' },
  { name: 'Marty Linsky', role: 'Analyst', team: 'Fundamental Team', imageUrl: martin_linsky, linkedIn: 'https://www.linkedin.com/in/martin-linsky/' },
  { name: 'Matthew Vacek', role: 'Analyst', team: 'Fundamental Team', imageUrl: matthew_vacek, linkedIn: 'https://www.linkedin.com/in/matthew-c-vacek/' },
  { name: 'Michael Luther', role: 'Analyst', team: 'Fundamental Team', imageUrl: michael_luterh, linkedIn: 'https://www.linkedin.com/in/michael-a-luther/' },
  { name: 'Patrick Eskildsen', role: 'Analyst', team: 'Fundamental Team', imageUrl: patrick_eskildsen, linkedIn: 'https://www.linkedin.com/in/patrick-eskildsen/' },
  { name: 'Reed Plotnick', role: 'Analyst', team: 'Fundamental Team', imageUrl: reed_plotnick, linkedIn: 'https://www.linkedin.com/in/reedplotnick/' },
  { name: 'Saketh Ram Kannoju', role: 'Analyst', team: 'Fundamental Team', imageUrl: saketh_ram_kannuoju, linkedIn: 'https://www.linkedin.com/in/sakethkannoju/' },
  { name: 'Tyson Nguyen', role: 'Analyst', team: 'Fundamental Team', imageUrl: tyson_nguyen, linkedIn: 'https://www.linkedin.com/in/tyson-nguyen-b40920233/' },
  { name: 'Boburkhan Djumanov', role: 'Analyst', team: 'Fundamental Team', imageUrl: boburkhan_djumanov, linkedIn: 'https://www.linkedin.com/in/boburkhandjumanov/' },
]

const executiveBoardNames = ['Vishesh Gupta', 'Krishi Cherukupalli', 'Joseph Asselta', 'Cooper Dorf', 'Kushal Kapoor']

function firstName(name: string) {
  return name.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
}

function sortAlpha<T extends { name: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => firstName(a.name).localeCompare(firstName(b.name), 'en'))
}

const MeetTheTeam = () => {
  const allMembers = [...quantitativeMembers, ...fundamentalMembers]
  const executiveBoardMembers = sortAlpha(allMembers.filter(m => executiveBoardNames.includes(m.name)))
  const quantOther = sortAlpha(quantitativeMembers.filter(m => !executiveBoardNames.includes(m.name)))
  const fundOther = sortAlpha(fundamentalMembers.filter(m => !executiveBoardNames.includes(m.name)))

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72 }}>
      <style>{`
        @keyframes heroSlideIn {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-slide {
          opacity: 0;
          animation: heroSlideIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      {/* ════ HERO ════ */}
      <div style={{ background: HERO_GRADIENT, overflowX: 'hidden' }}>
        <Header />
        <section
          className="max-w-7xl mx-auto px-6 sm:px-8"
          style={{ position: 'relative', paddingTop: 80, paddingBottom: 96 }}
        >
          {/* Graphic — absolutely positioned, right side */}
          <div
            className="hidden lg:block"
            style={{
              position: 'absolute',
              right: '4%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '38%',
              pointerEvents: 'none',
            }}
          >
            <TeamGraphic />
          </div>

          {/* Text — left side */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 9% 0 8%' }}>
            <div className="hero-slide" style={{ marginBottom: 20, animationDelay: '0.05s' }}>
              <span style={{ color: 'rgba(220,236,244,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Our People
              </span>
            </div>
            <h1
              className="hero-slide"
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(44px, 6vw, 80px)',
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: '#DCF0F8',
                margin: '0 0 20px 0',
                animationDelay: '0.18s',
              }}
            >
              Meet The Team.
            </h1>
            <p className="hero-slide" style={{ color: 'rgba(220,240,250,0.75)', fontSize: 18, lineHeight: 1.7, maxWidth: 440, animationDelay: '0.30s' }}>
              Get to know the students driving Apex Fund's research and investment strategies.
            </p>
          </div>
        </section>
      </div>

      {/* ════ BODY SECTIONS ════ */}
      <div style={{ backgroundColor: '#fff' }}>

        {/* Executive Board */}
        <section id="executive-board" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 80, paddingBottom: 80, scrollMarginTop: 72 }}>
          <div style={{ marginLeft: '8%', marginRight: '9%' }}>
            <AccentLabel>Leadership</AccentLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', color: '#0C1929', margin: '0 0 40px 0' }}>
              Executive Board
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {executiveBoardMembers.map((member, i) => (
                <MemberCard
                  key={i}
                  name={member.name}
                  role={member.role}
                  team={member.team}
                  imageUrl={member.imageUrl}
                  linkedinUrl={member.linkedIn}
                />
              ))}
            </div>
          </div>
        </section>


        {/* Quantitative Team */}
        <section id="quantitative-team" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 80, paddingBottom: 80, scrollMarginTop: 72 }}>
          <div style={{ marginLeft: '8%', marginRight: '9%' }}>
            <AccentLabel>Analysts</AccentLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', color: '#0C1929', margin: '0 0 40px 0' }}>
              Quantitative Team
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {quantOther.map((member, i) => (
                <MemberCard
                  key={i}
                  name={member.name}
                  role={member.role}
                  team={member.team}
                  imageUrl={member.imageUrl}
                  linkedinUrl={member.linkedIn}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Fundamental Team */}
        <section id="fundamental-team" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 80, paddingBottom: 96, scrollMarginTop: 72 }}>
          <div style={{ marginLeft: '8%', marginRight: '9%' }}>
            <AccentLabel>Analysts</AccentLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', color: '#0C1929', margin: '0 0 40px 0' }}>
              Fundamental Team
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {fundOther.map((member, i) => (
                <MemberCard
                  key={i}
                  name={member.name}
                  role={member.role}
                  team={member.team}
                  imageUrl={member.imageUrl}
                  linkedinUrl={member.linkedIn}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default MeetTheTeam
