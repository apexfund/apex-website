import Header from '../components/header'
import Footer from '../components/footer'
const HERO_GRADIENT = 'linear-gradient(145deg, #1B5470 0%, #2B7291 30%, #3E8DAA 65%, #6BAABF 100%)'
const CREAM   = '#F1EDEE'
const TEXT    = '#0C1929'
const ACCENT  = '#96BFCF'
const SERIF   = 'Georgia, serif'
const PLUS_BG = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2396bfcf' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

const values = [
  {
    title: 'Community',
    body: 'Apex is more than a fund. It\'s a tight-knit family where you\'ll find yourself surrounded by driven, like-minded people who push each other to grow, share ideas, and open doors for one another. The friendships you build here tend to last a lifetime.',
  },
  {
    title: 'Integrity',
    body: 'We hold ourselves to the same professional standards as the institutions we aspire to join: transparency, accountability, and disciplined decision-making.',
  },
  {
    title: 'Ambition',
    body: 'We set high standards for ourselves and never settle for good enough. Every thesis, every model, and every presentation should reflect our best work.',
  },
  {
    title: 'Ownership',
    body: 'Members take genuine responsibility for their research, their ideas, and the fund\'s outcomes. If something needs doing, we do it.',
  },
  {
    title: 'Curiosity',
    body: 'We question assumptions, dig deeper than the surface, and approach every market with the mindset of a perpetual learner.',
  },
  {
    title: 'Humility',
    body: 'Markets humble everyone. We stay open to being wrong, actively seek feedback, and know that the best ideas come from listening as much as speaking.',
  },
]

/**
 * Concentric diamond / compass-rose graphic.
 * Represents precision, focus, and a clear sense of direction —
 * fitting for the "Our Mission" page.
 */
function MissionGraphic() {
  const cx = 240, cy = 240
  const col = (op: number) => `rgba(255,255,255,${op})`

  // Radii for each concentric diamond
  const radii = [48, 98, 148, 198, 238]

  // Diamond path centered at (cx, cy) with half-size r
  const diamond = (r: number) =>
    `M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`

  // Cardinal directions for radial lines & tick marks
  const cardinals: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  // Ordinal directions (diagonals) for faint cross-lines
  const ordinals: [number, number][] = [
    [0.707, -0.707], [0.707, 0.707], [-0.707, 0.707], [-0.707, -0.707],
  ]

  // Perimeter of a diamond = 4 sides × (r√2)
  const perim = (r: number) => Math.round(r * 5.657)

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
          @keyframes missionDraw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes missionFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .mission-core {
            opacity: 0;
            animation: missionFade 0.25s ease 0s forwards;
          }
          .mission-radials {
            opacity: 0;
            animation: missionFade 0.6s ease 0.2s forwards;
          }
          .mission-ticks {
            opacity: 0;
            animation: missionFade 0.5s ease 0.95s forwards;
          }
          .mission-outer-dots {
            opacity: 0;
            animation: missionFade 0.4s ease 1.25s forwards;
          }
        `}</style>
      </defs>

      {/* Center dot — appears first */}
      <circle cx={cx} cy={cy} r={5} fill={col(0.55)} className="mission-core" />

      {/* Inner filled diamond — appears with center */}
      <path d={diamond(18)} fill={col(0.45)} className="mission-core" />

      {/* Faint diagonal radial lines */}
      <g className="mission-radials">
        {ordinals.map(([dx, dy], i) => (
          <line key={`ord-${i}`}
            x1={cx} y1={cy}
            x2={cx + dx * 240} y2={cy + dy * 240}
            stroke={col(0.05)} strokeWidth="0.8"
          />
        ))}
      </g>

      {/* Cardinal radial lines */}
      <g className="mission-radials">
        {cardinals.map(([dx, dy], i) => (
          <line key={`card-${i}`}
            x1={cx} y1={cy}
            x2={cx + dx * 240} y2={cy + dy * 240}
            stroke={col(0.09)} strokeWidth="0.9"
          />
        ))}
      </g>

      {/* Concentric diamonds — draw innermost → outermost */}
      {[...radii].reverse().map((r, i) => {
        const idx = radii.length - 1 - i   // idx=0 for r=48 (inner), idx=4 for r=238 (outer)
        const opacity = 0.07 + idx * 0.09
        const strokeW = 0.9 + idx * 0.25
        const p = perim(r)
        const delay = idx * 0.18           // smaller r animates first
        return (
          <path key={r}
            d={diamond(r)}
            stroke={col(opacity)}
            strokeWidth={strokeW}
            fill="none"
            style={{
              strokeDasharray: p,
              strokeDashoffset: p,
              animation: `missionDraw 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s forwards`,
            }}
          />
        )
      })}

      {/* Tick marks — fade in once rings are mostly drawn */}
      <g className="mission-ticks">
        {cardinals.map(([dx, dy], di) =>
          radii.slice(0, 4).map((r, ri) => {
            const px = cx + dx * r
            const py = cy + dy * r
            const tx = dy * 6, ty = dx * 6
            return (
              <line key={`tick-${di}-${ri}`}
                x1={px - tx} y1={py - ty}
                x2={px + tx} y2={py + ty}
                stroke={col(0.22)} strokeWidth="1.1"
              />
            )
          })
        )}
      </g>

      {/* Outer corner dots — last to appear */}
      <g className="mission-outer-dots">
        {cardinals.map(([dx, dy], i) => (
          <circle key={`dot-${i}`}
            cx={cx + dx * 238} cy={cy + dy * 238}
            r={3.5} fill={col(0.22)}
          />
        ))}
      </g>
    </svg>
  )
}

export default function OurMission() {
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
          {/* Graphic — absolutely positioned, right side, right edge aligned with nav bar */}
          <div
            className="hidden lg:block"
            style={{
              position: 'absolute',
              right: '9%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '26%',
              pointerEvents: 'none',
            }}
          >
            <MissionGraphic />
          </div>

          {/* Text — left side, same margins as homepage */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 9% 0 8%' }}>
            <div className="hero-slide" style={{ marginBottom: 20, animationDelay: '0.05s' }}>
              <span style={{ color: 'rgba(220,236,244,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                About Apex
              </span>
            </div>
            <h1 className="hero-slide" style={{
              fontFamily: SERIF,
              fontSize: 'clamp(44px, 6vw, 80px)',
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#DCF0F8',
              margin: '0 0 20px 0',
              animationDelay: '0.18s',
            }}>
              Our Mission
            </h1>
            <p className="hero-slide" style={{ fontSize: 18, color: 'rgba(220,240,250,0.75)', lineHeight: 1.75, maxWidth: 480, margin: 0, animationDelay: '0.30s' }}>
              Building the next generation of exceptional financial leaders through
              real-world investment experience at the University of Maryland.
            </p>
          </div>
        </section>
      </div>

      {/* ════ BODY ════ */}
      <div style={{ backgroundColor: '#fff' }}>

        {/* Mission statement */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <div style={{ marginLeft: '8%', marginRight: '9%' }}>
          <div style={{ display: 'grid', gap: 48 }} className="lg:grid-cols-2 lg:gap-24 lg:items-start">
            <div>
              <div style={{ marginBottom: 20 }}>
                <span style={{ color: ACCENT, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  What We Stand For
                </span>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: TEXT, margin: 0 }}>
                Building<br />Future<br />Leaders.
              </h2>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.8, color: '#4B5563', margin: '0 0 36px 0' }}>
                To provide{' '}
                <strong style={{ fontWeight: 600, color: TEXT }}>real-world financial experience</strong>{' '}
                to students by managing a{' '}
                <strong style={{ fontWeight: 600, color: TEXT }}>diversified portfolio</strong>,
                fostering crucial{' '}
                <strong style={{ fontWeight: 600, color: TEXT }}>analytical skills</strong>,
                and building a community of{' '}
                <strong style={{ fontWeight: 600, color: TEXT }}>future financial leaders</strong>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {[
                  { value: '~$9,780', label: 'Assets Under Management' },
                  { value: '2020',    label: 'Year Founded' },
                  { value: '30+',     label: 'Investment Team Members' },
                  { value: '2',       label: 'Investment Tracks' },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 400, color: TEXT, margin: '0 0 4px 0' }}>{s.value}</p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <div style={{ marginLeft: '8%', marginRight: '9%' }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ color: ACCENT, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Our Values
              </span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', color: TEXT, margin: '0 0 56px 0' }}>
              What Drives Us
            </h2>
            <div style={{ display: 'grid', gap: 40 }} className="sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => (
                <div key={i}>
                  <p style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, color: TEXT, margin: '0 0 12px 0' }}>{v.title}</p>
                  <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


      </div>

      <Footer />
    </div>
  )
}
