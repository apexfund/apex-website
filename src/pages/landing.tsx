import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import PlacementsImg from "../assets/companies.png";
import SponsorshipsImg from "../assets/sponsors.png";

/* ─── tokens ─────────────────────────────────────────────── */
const STRIP      = '#96BFCF'
const ON_STRIP   = '#0C1929'
const ON_STRIP_M = 'rgba(12,25,41,0.58)'
const SERIF      = 'Georgia, serif'

/* Hero gradient — deeper blue so white text reads comfortably */
const HERO_GRADIENT = 'linear-gradient(145deg, #1B5470 0%, #2B7291 30%, #3E8DAA 65%, #6BAABF 100%)'

/* ─── Mountain + chart graphic (matches logo motif) ─────── */
function HeroGraphic() {
  const na = (op: number) => `rgba(255,255,255,${op})`

  /* Mountain ridge points — angular, matches logo style */
  const ridge = [
    [0,   430],
    [50,  360],
    [95,  285],   // shoulder
    [130, 195],   // peak 1 (left, smaller)
    [160, 255],   // valley
    [200, 110],   // peak 2 (center, tallest)
    [240, 270],   // valley
    [280, 185],   // peak 3 (center-right)
    [330, 295],   // valley
    [375, 230],   // peak 4 (right)
    [440, 310],
    [480, 290],
  ]

  const ridgePath  = ridge.map(([x,y], i) => `${i===0?'M':'L'}${x},${y}`).join(' ')
  const fillPath   = ridgePath + ` L480,480 L0,480 Z`

  /* Geometric triangulation lines (logo-inspired faceting) */
  const facets = [
    // Peak 2 (tallest) — main focal point
    [[200,110],[170,210]],
    [[200,110],[230,220]],
    [[160,255],[195,215]],
    [[195,215],[240,270]],
    // cross-facet band
    [[130,195],[165,245]],
    [[165,245],[160,255]],
    // Peak 1
    [[130,195],[105,270]],
    [[130,195],[155,260]],
    // Peak 3
    [[280,185],[260,250]],
    [[280,185],[305,255]],
    [[260,250],[295,290]],
    // Peak 4
    [[375,230],[355,290]],
    [[375,230],[400,280]],
    // horizontal contour suggestions
    [[95,285],[130,195]],   // ridge connectors (already part of outline)
  ]

  /* Horizontal contour lines (topographic feel) */
  const contours = [
    { y: 310, x1: 65,  x2: 360, dash: '5 5' },
    { y: 255, x1: 100, x2: 290, dash: '4 5' },
    { y: 200, x1: 130, x2: 260, dash: '3 5' },
    { y: 155, x1: 160, x2: 235, dash: '3 6' },
  ]

  /* Rising chart / trend line — mirrors the logo's arrow motif */
  const chart = [
    [15, 415], [55, 370], [100, 305],
    [140, 245], [185, 185], [220, 215],
    [260, 155], [305, 175], [355, 100],
    [400,  75], [440,  48],
  ]
  const chartPath = chart.map(([x,y], i) => `${i===0?'M':'L'}${x},${y}`).join(' ')

  /* Arrow head at end of chart line, pointing upper-right */
  const [ax, ay] = chart[chart.length - 1]
  const arrowAngle = Math.atan2(
    chart[chart.length-2][1] - ay,
    chart[chart.length-2][0] - ax
  )
  const arrow = [
    [ax + 14*Math.cos(arrowAngle - 0.4), ay + 14*Math.sin(arrowAngle - 0.4)],
    [ax + 14*Math.cos(arrowAngle + 0.4), ay + 14*Math.sin(arrowAngle + 0.4)],
  ]

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
          @keyframes apexFillReveal {
            from { clip-path: inset(0 100% 0 0); }
            to   { clip-path: inset(0 0%   0 0); }
          }
          @keyframes apexDrawLine {
            to { stroke-dashoffset: 0; }
          }
          @keyframes apexFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .apex-fill {
            animation: apexFillReveal 1.8s cubic-bezier(0.76, 0, 0.24, 1) 0.2s both;
          }
          .apex-ridge {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: apexDrawLine 1.8s cubic-bezier(0.76, 0, 0.24, 1) 0.2s forwards;
          }
          .apex-facets {
            opacity: 0;
            animation: apexFadeIn 0.7s ease 1.3s forwards;
          }
          .apex-contours {
            opacity: 0;
            animation: apexFadeIn 0.7s ease 1.5s forwards;
          }
          .apex-chart {
            stroke-dasharray: 1400;
            stroke-dashoffset: 1400;
            animation: apexDrawLine 1.3s cubic-bezier(0.76, 0, 0.24, 1) 1.6s forwards;
          }
          .apex-finish {
            opacity: 0;
            animation: apexFadeIn 0.5s ease 2.6s forwards;
          }
        `}</style>
      </defs>

      {/* Mountain fill — very faint, reveals left → right */}
      <path d={fillPath} fill={na(0.06)} className="apex-fill" />

      {/* Mountain outline — draws left → right */}
      <path
        d={ridgePath}
        stroke={na(0.40)} strokeWidth="1.8"
        fill="none" strokeLinejoin="miter"
        className="apex-ridge"
      />

      {/* Facet / triangulation lines — fade in after outline */}
      <g className="apex-facets">
        {facets.map(([[x1,y1],[x2,y2]], i) => (
          <line key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={na(0.18)} strokeWidth="1"
          />
        ))}
      </g>

      {/* Topographic contour lines + base line — fade in after facets */}
      <g className="apex-contours">
        {contours.map((c, i) => (
          <line key={i}
            x1={c.x1} y1={c.y} x2={c.x2} y2={c.y}
            stroke={na(0.10)} strokeWidth="0.9"
            strokeDasharray={c.dash}
          />
        ))}
        <line x1={0} y1={435} x2={480} y2={435} stroke={na(0.10)} strokeWidth="1" />
      </g>

      {/* Rising trend line — draws in after mountain settles */}
      <path
        d={chartPath}
        stroke={na(0.60)} strokeWidth="2.2"
        fill="none" strokeLinejoin="round" strokeLinecap="round"
        className="apex-chart"
      />

      {/* Arrow head + peak dots — pop in once chart finishes */}
      <g className="apex-finish">
        <polygon
          points={`${ax},${ay} ${arrow[0][0]},${arrow[0][1]} ${arrow[1][0]},${arrow[1][1]}`}
          fill={na(0.60)}
        />
        {[[130,195],[200,110],[280,185],[375,230]].map(([x,y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={3.5} fill={na(0.45)} />
        ))}
      </g>
    </svg>
  )
}

/* ─── Shared sub-components ─────────────────────────────── */

/* ─── Landing page ─────────────────────────────────────── */
const Landing = () => {
  const [animatedNumber, setAnimatedNumber] = useState(0)

  useEffect(() => {
    const duration = 5000, target = 9780, start = Date.now()
    const animate = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 6)
      const rand = p < 0.7 ? (Math.random() - 0.5) * 0.05 : 0
      setAnimatedNumber(Math.max(0, Math.min(Math.floor(target * eased + target * rand), target)))
      if (p < 1) requestAnimationFrame(animate); else setAnimatedNumber(target)
    }
    const t = setTimeout(() => requestAnimationFrame(animate), 600)
    return () => clearTimeout(t)
  }, [])

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

      {/* ════ GRADIENT — hero + placements + sponsors ════ */}
      <div style={{ background: HERO_GRADIENT, overflowX: 'hidden' }}>
        <Header />

        <section
          className="max-w-7xl mx-auto px-6 sm:px-8"
          style={{ position: 'relative', paddingTop: 80, paddingBottom: 80 }}
        >
          {/* Mountain — background graphic, right side */}
          <div
            className="hidden lg:block"
            style={{
              position: 'absolute',
              right: -100,
              top: '-4%',
              width: '72%',
              pointerEvents: 'none',
            }}
          >
            <HeroGraphic />
          </div>

          {/* Heading — left side */}
          <div className="section-inner" style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
            {/* Label — white variant for hero */}
            <div className="hero-slide" style={{ marginBottom: 20, animationDelay: '0.05s' }}>
              <span style={{ color: 'rgba(220,236,244,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Apex Fund · University of Maryland
              </span>
            </div>

            <h1 className="hero-slide" style={{
              fontFamily: SERIF,
              fontSize: 'clamp(38px, 4.8vw, 70px)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#DCF0F8',
              margin: '0 0 24px 0',
              animationDelay: '0.18s',
            }}>
              Where Future<br />
              Financial Leaders<br />
              Are Made.
            </h1>

            <p className="hero-slide" style={{ color: 'rgba(220,240,250,0.75)', fontSize: 17, lineHeight: 1.8, maxWidth: 480, margin: 0, animationDelay: '0.32s' }}>
              Apex Fund is a student-managed investment fund at UMD. We provide
              real-world financial experience by managing{' '}
              <strong style={{ color: '#DCF0F8', fontWeight: 600 }}>
                ~${animatedNumber.toLocaleString()}
              </strong>{' '}
              in assets through{' '}
              <span style={{ color: '#DCF0F8' }}>quantitative trading</span>{' '}
              and <span style={{ color: '#DCF0F8' }}>fundamental analysis</span>.
            </p>
          </div>

          {/* Stats — full-width across the hero, BAM-style */}
          <div
            className="section-inner grid grid-cols-1 sm:grid-cols-3"
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 56,
              gap: 32,
            }}
          >
            {[
              { value: `~$${animatedNumber.toLocaleString()}`, label: 'Assets Under Management' },
              { value: '30+',  label: 'Investment Team Members' },
              { value: '2020', label: 'Year Founded' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="hero-slide"
                style={{
                  animationDelay: `${0.46 + i * 0.13}s`,
                }}
              >
                <p style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(24px, 3.2vw, 44px)',
                  fontWeight: 400,
                  color: '#DCF0F8',
                  margin: '0 0 8px 0',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 13, color: 'rgba(220,240,250,0.65)', margin: 0, letterSpacing: '0.02em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Member Placements */}
        <section id="placements" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="section-inner">
            <div style={{ marginBottom: 20 }}>
              <span style={{ color: 'rgba(220,240,250,0.75)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Alumni Network</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(30px,4vw,52px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#DCF0F8', margin: '0 0 16px 0' }}>
              Member Placements
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(220,240,250,0.65)', lineHeight: 1.7, maxWidth: 500, margin: '0 0 48px 0' }}>
              Our members have secured positions at top firms in the industry, a testament to the skills gained through Apex.
            </p>
            <div style={{ borderRadius: 16, padding: 32, background: 'rgba(220,240,250,0.04)', boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(220,240,250,0.08)', backdropFilter: 'blur(8px)' }}>
              <img src={PlacementsImg} alt="Company logos of member placements" style={{ display: 'block', width: '100%', height: 'auto', opacity: 0.9, borderRadius: 8 }} />
            </div>
          </div>
        </section>

        {/* Sponsorships */}
        <section id="sponsorships" className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="section-inner">
            <div style={{ marginBottom: 20 }}>
              <span style={{ color: 'rgba(220,240,250,0.75)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Partners</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(30px,4vw,52px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#DCF0F8', margin: '0 0 16px 0' }}>
              Sponsorships
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(220,240,250,0.65)', lineHeight: 1.7, maxWidth: 500, margin: '0 0 48px 0' }}>
              We're grateful to partner with organizations that support Apex and our members.
            </p>
            <div style={{ borderRadius: 16, padding: 32, background: 'rgba(220,240,250,0.04)', boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(220,240,250,0.08)', backdropFilter: 'blur(8px)' }}>
              <img src={SponsorshipsImg} alt="Sponsor logos" style={{ display: 'block', width: '100%', height: 'auto', opacity: 0.9, borderRadius: 8 }} />
            </div>
          </div>
        </section>

      </div>

      {/* ════ LIGHT-BLUE CTA STRIP ════ */}
      <div style={{ backgroundColor: STRIP, paddingTop: 96, paddingBottom: 96 }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ color: 'rgba(12,25,41,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Join the Team
            </span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(40px,5.5vw,72px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: ON_STRIP, margin: '0 0 20px 0' }}>
            Ready to Join?
          </h2>
          <p style={{ color: ON_STRIP_M, fontSize: 17, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 40px' }}>
            Applications open each semester. Gain real-world investment experience at UMD.
          </p>
          <Link
            to="/join-us"
            style={{ display: 'inline-block', padding: '14px 36px', backgroundColor: ON_STRIP, color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: '0.03em', textDecoration: 'none', borderRadius: 2 }}
          >
            View Opportunities →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Landing
