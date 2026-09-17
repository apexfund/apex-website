import { useQuery } from 'convex/react'
import Header from '../components/header'
import Footer from '../components/footer'
import MemberCard from '../components/MemberCard'
import { api } from '../../convex/_generated/api'

const HERO_GRADIENT = 'linear-gradient(145deg, #1B5470 0%, #2B7291 30%, #3E8DAA 65%, #6BAABF 100%)'
const ACCENT = '#96BFCF'
const SERIF = 'Georgia, serif'

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
function AccentLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ color: ACCENT, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
        {children}
      </span>
    </div>
  )
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
}

function sortAlpha<T extends { name: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => firstName(a.name).localeCompare(firstName(b.name), 'en'))
}

// Convex may not be configured in every build (e.g. static preview); guard it.
function useOptionalQuery<T>(query: Parameters<typeof useQuery>[0]): T | undefined {
  const hasConvex = !!import.meta.env.VITE_CONVEX_URL
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return hasConvex ? (useQuery(query) as T | undefined) : undefined
}

type TeamMember = {
  _id: string
  name: string
  role: string
  team: string | null
  execBoard: boolean
  linkedIn: string | null
  url: string | null
}

const MeetTheTeam = () => {
  const members = useOptionalQuery<TeamMember[]>(api.teamMembers.list) ?? []
  const executiveBoardMembers = sortAlpha(members.filter(m => m.execBoard))
  const quantOther = sortAlpha(members.filter(m => !m.execBoard && m.team === 'Quantitative Team'))
  const fundOther = sortAlpha(members.filter(m => !m.execBoard && m.team === 'Fundamental Team'))

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
          <div className="section-inner" style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
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
        {executiveBoardMembers.length > 0 && (
        <section id="executive-board" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 80, paddingBottom: 80, scrollMarginTop: 72 }}>
          <div className="section-inner">
            <AccentLabel>Leadership</AccentLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', color: '#0C1929', margin: '0 0 40px 0' }}>
              Executive Board
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {executiveBoardMembers.map(member => (
                <MemberCard
                  key={member._id}
                  name={member.name}
                  role={member.role}
                  team={member.team ?? undefined}
                  imageUrl={member.url ?? undefined}
                  linkedinUrl={member.linkedIn ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
        )}


        {/* Quantitative Team */}
        {quantOther.length > 0 && (
        <section id="quantitative-team" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 80, paddingBottom: 80, scrollMarginTop: 72 }}>
          <div className="section-inner">
            <AccentLabel>Analysts</AccentLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', color: '#0C1929', margin: '0 0 40px 0' }}>
              Quantitative Team
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {quantOther.map(member => (
                <MemberCard
                  key={member._id}
                  name={member.name}
                  role={member.role}
                  team={member.team ?? undefined}
                  imageUrl={member.url ?? undefined}
                  linkedinUrl={member.linkedIn ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Fundamental Team */}
        {fundOther.length > 0 && (
        <section id="fundamental-team" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 80, paddingBottom: 96, scrollMarginTop: 72 }}>
          <div className="section-inner">
            <AccentLabel>Analysts</AccentLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em', color: '#0C1929', margin: '0 0 40px 0' }}>
              Fundamental Team
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {fundOther.map(member => (
                <MemberCard
                  key={member._id}
                  name={member.name}
                  role={member.role}
                  team={member.team ?? undefined}
                  imageUrl={member.url ?? undefined}
                  linkedinUrl={member.linkedIn ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default MeetTheTeam
