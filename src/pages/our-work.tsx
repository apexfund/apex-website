import React from 'react'
import PostCard from '../components/PostCard'
import { allPosts } from '../utils/posts'
import Header from '../components/header'
import Footer from '../components/footer'

const HERO_GRADIENT = 'linear-gradient(145deg, #1B5470 0%, #2B7291 30%, #3E8DAA 65%, #6BAABF 100%)'
const ACCENT = '#96BFCF'
const CREAM = '#F1EDEE'
const SERIF = 'Georgia, serif'
const PLUS_BG = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2396bfcf' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

/**
 * OHLC candlestick chart with a rising trend line.
 * Represents financial research, data analysis, and market work.
 */
function WorkGraphic() {
  const col = (op: number) => `rgba(255,255,255,${op})`

  // Horizontal grid lines
  const gridYs = [90, 175, 260, 345, 420]

  // [x, openY, closeY, highY, lowY] — lower Y = higher price
  const candles: [number, number, number, number, number][] = [
    [72,  395, 320, 305, 415],
    [124, 315, 255, 238, 330],
    [176, 260, 300, 295, 245],  // down candle
    [228, 295, 225, 210, 308],
    [280, 220, 160, 147, 234],
    [332, 155, 200, 196, 140],  // down candle
    [384, 205, 128, 115, 218],
    [430, 122,  72,  58, 136],
  ]

  // Trend line through close prices
  const trendPts = candles.map(([x, , closeY]) => [x, closeY])
  const trendPath = trendPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')

  // Arrow at end of trend line
  const [lx, ly] = trendPts[trendPts.length - 1]
  const [px, py] = trendPts[trendPts.length - 2]
  const angle = Math.atan2(py - ly, px - lx)
  const arrowL = [[lx + 14 * Math.cos(angle - 0.42), ly + 14 * Math.sin(angle - 0.42)],
                  [lx + 14 * Math.cos(angle + 0.42), ly + 14 * Math.sin(angle + 0.42)]]

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
          @keyframes workFade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes workDraw {
            to { stroke-dashoffset: 0; }
          }
          .work-bg {
            opacity: 0;
            animation: workFade 0.5s ease 0s forwards;
          }
          .work-finish {
            opacity: 0;
            animation: workFade 0.4s ease 1.6s forwards;
          }
        `}</style>
      </defs>

      {/* Grid lines + axes — appear first */}
      <g className="work-bg">
        {gridYs.map(y => (
          <line key={y} x1={44} y1={y} x2={455} y2={y}
            stroke={col(0.07)} strokeWidth="1" strokeDasharray="4 5" />
        ))}
        <line x1={50} y1={48} x2={50} y2={432} stroke={col(0.10)} strokeWidth="1" />
        <line x1={50} y1={432} x2={455} y2={432} stroke={col(0.10)} strokeWidth="1" />
      </g>

      {/* Candlesticks — stagger left → right */}
      {candles.map(([x, openY, closeY, highY, lowY], i) => {
        const isUp = closeY < openY
        const bodyTop = Math.min(openY, closeY)
        const bodyH = Math.max(Math.abs(openY - closeY), 4)
        return (
          <g key={x} style={{
            opacity: 0,
            animation: `workFade 0.35s ease ${0.1 + i * 0.13}s forwards`,
          }}>
            <line x1={x} y1={highY} x2={x} y2={lowY}
              stroke={col(0.28)} strokeWidth="1.5" />
            <rect
              x={x - 13} y={bodyTop}
              width={26} height={bodyH}
              fill={isUp ? col(0.18) : col(0.05)}
              stroke={col(isUp ? 0.38 : 0.20)}
              strokeWidth="1.2"
            />
          </g>
        )
      })}

      {/* Rising trend line — draws left → right */}
      <path
        d={trendPath}
        stroke={col(0.65)} strokeWidth="2.2"
        fill="none" strokeLinejoin="round" strokeLinecap="round"
        style={{
          strokeDasharray: 700,
          strokeDashoffset: 700,
          animation: 'workDraw 1.2s cubic-bezier(0.76, 0, 0.24, 1) 0.4s forwards',
        }}
      />

      {/* Arrow head + dots — appear after trend line settles */}
      <g className="work-finish">
        <polygon
          points={`${lx},${ly} ${arrowL[0][0]},${arrowL[0][1]} ${arrowL[1][0]},${arrowL[1][1]}`}
          fill={col(0.65)}
        />
        {trendPts.map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={3} fill={col(0.50)} />
        ))}
      </g>
    </svg>
  )
}

export default function OurWork() {
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
            <WorkGraphic />
          </div>

          {/* Text — left side */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 9% 0 8%' }}>
            <div className="hero-slide" style={{ marginBottom: 20, animationDelay: '0.05s' }}>
              <span style={{ color: 'rgba(220,236,244,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Research
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
              Strategies &amp;<br />
              Reportings.
            </h1>
            <p className="hero-slide" style={{ color: 'rgba(220,240,250,0.75)', fontSize: 18, lineHeight: 1.7, maxWidth: 460, animationDelay: '0.30s' }}>
              All of Apex Fund's outlined strategies, original research, and market analyses.
            </p>
          </div>
        </section>
      </div>

      {/* ════ CONTENT ════ */}
      <div style={{ backgroundColor: '#fff', minHeight: '50vh' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 80, paddingBottom: 96 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: 720, marginBottom: 48 }}>
              <span style={{ color: ACCENT, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {allPosts.length} {allPosts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>

            <div style={{ width: '100%', maxWidth: 720 }}>
              {allPosts.map((post, idx) => (
                <React.Fragment key={post.meta.slug}>
                  {idx !== 0 && (
                    <div style={{ height: 0 }} />
                  )}
                  <PostCard meta={post.meta} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
