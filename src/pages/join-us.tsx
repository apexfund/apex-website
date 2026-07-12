import Header from "../components/header"
import Footer from "../components/footer"
import PlacementsImg from "../assets/companies.png"

const HERO_GRADIENT = 'linear-gradient(145deg, #1B5470 0%, #2B7291 30%, #3E8DAA 65%, #6BAABF 100%)'
const STRIP      = '#96BFCF'
const ON_STRIP   = '#0C1929'
const ON_STRIP_M = 'rgba(12,25,41,0.58)'
const CREAM      = '#F1EDEE'
const ACCENT     = '#96BFCF'
const TEXT       = '#0C1929'
const SERIF      = 'Georgia, serif'
const PLUS_BG    = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2396bfcf' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

type Status = 'open' | 'closed'
interface Track { id: string; title: string; team: string; description: string; ideal: string; skills: string[]; status: Status; formLink: string }

const tracks: Track[] = [
  { id: 'quantitative', title: 'Quantitative Analyst', team: 'Quantitative Team', description: 'Work at the intersection of finance and technology. Members typically focus on one of two tracks: research and trading, where you develop algorithmic strategies, build backtesting frameworks, and analyze real market data; or development, where you build the tools, infrastructure, and software that power our trading systems. We have active projects in both areas.', ideal: 'Computer Science, Mathematics, Statistics, or Engineering majors', skills: ['Curiosity about markets', 'Willingness to learn', 'Analytical thinking', 'Python / R (optional but recommended)', 'Statistics / probability (optional)', 'SQL (optional)', 'Linear algebra (optional)'], status: 'closed', formLink: 'https://forms.gle/DddEiicn8J2XaAcs9' },
  { id: 'fundamental', title: 'Fundamental Analyst', team: 'Fundamental Team', description: 'Conduct in-depth research on public equities, build financial models, and develop investment theses. Manage real long/short positions and present recommendations to the investment committee.', ideal: 'Finance, Business, Economics, or Accounting majors', skills: ['Curiosity about markets', 'Willingness to learn', 'Strong work ethic', 'Excel / financial modeling (optional but recommended)', 'Accounting basics (optional)', 'DCF / valuation (optional)', 'Bloomberg / FactSet (optional)'], status: 'closed', formLink: '' },
]

const steps = [
  { n: '01', title: 'Submit Application', desc: 'Complete our online form when applications open each semester.' },
  { n: '02', title: 'Online Assessment', desc: 'Complete a short take-home assessment to demonstrate your technical and analytical skills.' },
  { n: '03', title: 'Interview', desc: 'Selected candidates are invited for a technical or behavioral interview with our team.' },
  { n: '04', title: 'Welcome to Apex', desc: 'Congratulations, you\'re in. Begin your journey with Apex Fund.' },
]

/**
 * Ascending geometric staircase graphic.
 * Represents career growth, the step-by-step journey to joining,
 * and the upward trajectory of Apex members.
 */
function JoinGraphic() {
  const col = (op: number) => `rgba(255,255,255,${op})`

  // Staircase outline going bottom-left → top-right
  // 5 steps, each tread 70px wide, each riser 70px tall
  const stairOutline = [
    'M 40,455',
    'L 40,385 L 110,385',
    'L 110,315 L 180,315',
    'L 180,245 L 250,245',
    'L 250,175 L 320,175',
    'L 320,105 L 390,105',
  ].join(' ')

  // Filled silhouette (close the shape along the bottom)
  const stairFill = stairOutline + ' L 390,455 Z'

  // Diagonal guide from start-corner to end-corner
  const diag = 'M 40,455 L 390,105'

  // Inner corners of each step (the "nose" corner)
  const noses: [number, number][] = [
    [110, 385],
    [180, 315],
    [250, 245],
    [320, 175],
    [390, 105],
  ]

  // Faint horizontal extension lines at each tread level
  const extLines: [number, number][] = [
    [390, 385],
    [390, 315],
    [390, 245],
    [390, 175],
  ]

  // Outline is exactly 700px (5 steps × 2 segments × 70px).
  // Dot i sits after (i+1) full steps = (i+1)*140px drawn.
  // Draw duration 1.5s starts at 0.3s → dot delay = 0.3 + ((i+1)*140/700)*1.5
  const noseDotDelay = (i: number) => +(0.3 + ((i + 1) * 140 / 700) * 1.5).toFixed(2)

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
          @keyframes joinFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes joinDraw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes joinFillReveal {
            from { clip-path: inset(0 100% 0 0); }
            to   { clip-path: inset(0 0%   0 0); }
          }
          .join-bg {
            opacity: 0;
            animation: joinFade 0.4s ease 0.1s forwards;
          }
          .join-start-dot {
            opacity: 0;
            animation: joinFade 0.3s ease 0s forwards;
          }
          .join-fill {
            animation: joinFillReveal 1.5s cubic-bezier(0.76, 0, 0.24, 1) 0.3s both;
          }
          .join-outline {
            stroke-dasharray: 700;
            stroke-dashoffset: 700;
            animation: joinDraw 1.5s cubic-bezier(0.76, 0, 0.24, 1) 0.3s forwards;
          }
        `}</style>
      </defs>

      {/* Background context — extension lines, diagonal, ground */}
      <g className="join-bg">
        {noses.slice(0, -1).map(([nx, ny], i) => (
          <line key={`ext-${i}`}
            x1={nx} y1={ny} x2={extLines[i][0]} y2={extLines[i][1]}
            stroke={col(0.06)} strokeWidth="0.9" strokeDasharray="4 5"
          />
        ))}
        <path d={diag} stroke={col(0.07)} strokeWidth="1" strokeDasharray="5 6" />
        <line x1={30} y1={455} x2={450} y2={455} stroke={col(0.12)} strokeWidth="1" />
      </g>

      {/* Start dot — appears first */}
      <circle cx={40} cy={455} r={3.5} fill={col(0.22)} className="join-start-dot" />

      {/* Staircase fill — reveals left → right in sync with the outline */}
      <path d={stairFill} fill={col(0.05)} className="join-fill" />

      {/* Staircase outline — draws from bottom-left to top-right */}
      <path
        d={stairOutline}
        stroke={col(0.50)} strokeWidth="2"
        fill="none" strokeLinejoin="miter" strokeLinecap="square"
        className="join-outline"
      />

      {/* Nose dots — pop in exactly when the stroke reaches each corner */}
      {noses.map(([x, y], i) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4.5} fill={col(0.42)}
          style={{
            opacity: 0,
            animation: `joinFade 0.25s ease ${noseDotDelay(i)}s forwards`,
          }}
        />
      ))}
    </svg>
  )
}

function StripLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ color: 'rgba(220,236,244,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>{children}</span>
    </div>
  )
}

function AccentLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span style={{ color: ACCENT, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>{children}</span>
    </div>
  )
}

function Divider() {
  return null
}

const JoinUs = () => (
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
          <JoinGraphic />
        </div>

        {/* Text — left side */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 9% 0 8%' }}>
          <div className="hero-slide" style={{ marginBottom: 20, animationDelay: '0.05s' }}>
            <span style={{ color: 'rgba(220,236,244,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Join Apex</span>
          </div>
          <h1 className="hero-slide" style={{ fontFamily: SERIF, fontSize: 'clamp(44px,6vw,80px)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#DCF0F8', margin: '0 0 24px 0', animationDelay: '0.18s' }}>
            Jumpstart Your Career<br />With Apex.
          </h1>
          <p className="hero-slide" style={{ color: 'rgba(220,240,250,0.75)', fontSize: 18, lineHeight: 1.7, maxWidth: 480, margin: 0, animationDelay: '0.30s' }}>
            Take away skills that matter, surround yourself with driven people, and grow into the finance professional you want to be. All while having a great time doing it.
          </p>
        </div>
      </section>
    </div>

    {/* ════ BODY SECTIONS ════ */}
    <div style={{ backgroundColor: '#fff' }}>

      {/* Why Apex + Placements */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ marginLeft: '8%', marginRight: '9%' }}>
          <AccentLabel>Why Apex</AccentLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,4vw,54px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: TEXT, margin: '0 0 48px 0' }}>
            Built to Launch Your Career.
          </h2>
          <div style={{ display: 'grid', gap: 40, marginBottom: 72 }} className="md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Real Capital', desc: 'Manage actual money, not simulations. Our fund deploys real capital across quantitative and fundamental strategies, giving you genuine market exposure.' },
              { title: 'Research Depth', desc: 'Publish original research, backtest strategies, and develop investment theses that inform real portfolio decisions alongside a community of peers.' },
              { title: 'Structured Education', desc: 'Every analyst goes through a hands-on program covering financial modeling, quantitative methods, and software engineering/quant dev, so you hit the ground running from day one.' },
              { title: 'Career Network', desc: 'Alumni placed at top hedge funds, investment banks, and technology firms. Benefit from active mentorship and direct recruiting connections.' },
            ].map(item => (
              <div key={item.title}>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, color: TEXT, margin: '0 0 12px 0' }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 32px 0' }}>Where our members have gone</p>
            <img
              src={PlacementsImg}
              alt="Company logos of member placements"
              style={{ display: 'block', width: '100%', height: 'auto', opacity: 0.9 }}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* Investment Tracks */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ marginLeft: '8%', marginRight: '9%' }}>
        <AccentLabel>Open Roles</AccentLabel>
        <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,4vw,54px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: TEXT, margin: '0 0 48px 0' }}>Investment Tracks</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {tracks.map(track => (
            <div key={track.id} style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.65)', padding: '40px 44px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="lg:flex-row lg:items-start lg:justify-between">

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', fontSize: 12, fontWeight: 500, letterSpacing: '0.03em', borderRadius: 2, backgroundColor: track.status === 'open' ? `${ACCENT}30` : 'rgba(0,0,0,0.06)', color: track.status === 'open' ? '#3A8FA3' : '#9CA3AF' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: track.status === 'open' ? '#3A8FA3' : '#D1D5DB', flexShrink: 0 }} />
                      {track.status === 'open' ? 'Applications Open' : 'Applications Closed'}
                    </span>
                    <span style={{ padding: '4px 12px', fontSize: 12, color: '#9CA3AF', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 2 }}>{track.team}</span>
                  </div>

                  <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(28px,3vw,40px)', fontWeight: 400, letterSpacing: '-0.01em', color: TEXT, margin: '0 0 18px 0', lineHeight: 1.1 }}>{track.title}</h3>
                  <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.75, maxWidth: 600, margin: '0 0 28px 0' }}>{track.description}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 11, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 8px 0' }}>Ideal Background</p>
                      <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>{track.ideal}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 10px 0' }}>Key Skills</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {track.skills.map(s => <span key={s} style={{ padding: '4px 10px', backgroundColor: 'rgba(0,0,0,0.06)', color: '#4B5563', fontSize: 12, borderRadius: 2 }}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }} className="lg:items-end lg:pt-2">
                  {track.status === 'open' && track.formLink
                    ? <a href={track.formLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: ACCENT, color: ON_STRIP, fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap' }}>Apply Now →</a>
                    : <span style={{ display: 'inline-block', padding: '12px 24px', border: '1px solid rgba(0,0,0,0.1)', color: '#D1D5DB', fontSize: 14, borderRadius: 2, whiteSpace: 'nowrap', cursor: 'not-allowed' }}>Applications Closed</span>
                  }
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>Opens each semester</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      <Divider />

      {/* How to Apply */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div style={{ marginLeft: '8%', marginRight: '9%' }}>
          <AccentLabel>Process</AccentLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,4vw,54px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: TEXT, margin: '0 0 56px 0' }}>How to Apply</h2>
          <div style={{ display: 'grid', gap: 40 }} className="sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(s => (
              <div key={s.n}>
                <p style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 400, color: 'rgba(0,0,0,0.22)', margin: '0 0 16px 0', lineHeight: 1 }}>{s.n}</p>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: TEXT, margin: '0 0 8px 0' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

    {/* ════ LIGHT-BLUE BOTTOM CTA ════ */}
    <div style={{ backgroundColor: STRIP, paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8" style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: ON_STRIP, margin: '0 0 16px 0' }}>Stay in the loop.</h2>
        <p style={{ color: ON_STRIP_M, fontSize: 17, lineHeight: 1.7, maxWidth: 360, margin: '0 auto 36px' }}>Follow Apex on TerpLink to get notified when applications open.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <a href="https://terplink.umd.edu/organization/apexfund" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '13px 32px', backgroundColor: ON_STRIP, color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 2 }}>Follow on TerpLink</a>
          <a href="mailto:apexfundquant@gmail.com" style={{ display: 'inline-block', padding: '13px 32px', border: '1px solid rgba(12,25,41,0.25)', color: ON_STRIP_M, fontSize: 14, textDecoration: 'none', borderRadius: 2 }}>Contact Us</a>
        </div>
      </div>
    </div>

    <Footer />
  </div>
)

export default JoinUs
