import { useCallback, useRef, useState } from 'react'

export type LogoItem = {
  _id: string
  name: string
  url: string | null
}

const GAP = 14

/**
 * Distribute `n` items across centered rows whose widths follow a circle's
 * chord length (√(1 − y²) sampled top-to-bottom). Combined with enough rows,
 * this makes the cluster read as a smooth disc rather than a rectangle or a
 * sharp diamond. Every row is centered; incomplete rows sit in the middle.
 */
function circularRows(n: number, maxPerRow: number): number[] {
  if (n <= 0) return []
  if (n <= 2) return [n]

  // Enough rows to curve the outline, but never so few that a row overflows.
  const desired = Math.max(3, Math.round(Math.sqrt(n * 1.5)))
  const R = Math.max(desired, Math.ceil(n / maxPerRow))

  // Circle-chord weight for each row's vertical position.
  const weights = Array.from({ length: R }, (_, i) => {
    const y = (2 * (i + 0.5)) / R - 1
    return Math.sqrt(Math.max(0, 1 - y * y))
  })
  const sum = weights.reduce((a, b) => a + b, 0)

  const counts = weights.map(w => Math.min(maxPerRow, Math.max(1, Math.round((w / sum) * n))))

  // Order rows by distance from the centre (for balanced +/- adjustments).
  const mid = (R - 1) / 2
  const byCentreAsc = counts.map((_, i) => i).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))
  const byCentreDesc = [...byCentreAsc].reverse()

  let total = counts.reduce((a, b) => a + b, 0)
  let guard = 0
  while (total < n && guard++ < 1000) {
    const idx = byCentreAsc.find(i => counts[i] < maxPerRow)
    if (idx === undefined) break
    counts[idx]++
    total++
  }
  guard = 0
  while (total > n && guard++ < 1000) {
    const idx = byCentreDesc.find(i => counts[i] > 1)
    if (idx === undefined) break
    counts[idx]--
    total--
  }

  return counts
}

/**
 * A self-balancing showcase of logos arranged in a rounded, tapered cluster of
 * pill cards. Tile size scales to the count, rows are centered and circle-chord
 * distributed for a disc-like feel, and hovering a card spotlights it and
 * reveals its name. Purely presentational — pass the logos to display.
 */
export default function LogoShowcase({
  logos: rawLogos,
  emptyLabel = 'Logos will appear here soon.',
  uniform = false,
  sizeScale = 1,
  light = false,
}: {
  logos: LogoItem[]
  emptyLabel?: string
  /** Render every tile as an equal-sized circle instead of a logo-hugging pill. */
  uniform?: boolean
  /** Multiplier on the logo size (e.g. 1.4 for larger logos). */
  sizeScale?: number
  /** Tune tile styling for a light background — thin dark outline, soft shadow. */
  light?: boolean
}) {
  const logos = rawLogos.filter(p => p.url)

  const [width, setWidth] = useState(360)
  const roRef = useRef<ResizeObserver | null>(null)

  // Callback ref so measurement (re)attaches whenever the wrapper mounts — the
  // wrapper renders in both the empty and populated states, so the width is
  // always measured even when the query is still loading on first paint.
  const measureRef = useCallback((el: HTMLDivElement | null) => {
    roRef.current?.disconnect()
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setWidth(e.contentRect.width)
    })
    ro.observe(el)
    roRef.current = ro
  }, [])

  // Scale tiles to the count (fewer → larger) but also cap by the available
  // width so logos shrink on tablets / phones instead of overflowing.
  const count = Math.max(logos.length, 1)
  const maxByWidth = (width < 480 ? 30 : width < 768 ? 42 : 60) * sizeScale
  const logoH = Math.round(Math.max(24 * sizeScale, Math.min(maxByWidth, (92 * sizeScale) / Math.sqrt(count))))
  const cell = Math.round(logoH * 3.2)
  const pad = Math.round(logoH * 0.46)

  // Uniform mode: every logo sits in an identical square card.
  const squareSize = Math.round(logoH * 3.4)
  const squarePad = Math.round(logoH * 0.55)
  const tileW = uniform ? squareSize : cell

  // Tighter gaps on small screens.
  const gap = width < 480 ? 8 : GAP

  // How many cards comfortably fit per row.
  const maxPerRow = Math.max(1, Math.min(logos.length, Math.floor((width + gap) / (tileW + gap))))

  // On narrow screens use a simple stacked layout — at most 2 per row (and a
  // single long column if even 2 don't fit) — instead of the circular taper.
  const isNarrow = width < 640
  let rowSizes: number[]
  if (isNarrow) {
    const perRow = Math.min(2, maxPerRow)
    rowSizes = []
    for (let remaining = logos.length; remaining > 0; remaining -= perRow) {
      rowSizes.push(Math.min(perRow, remaining))
    }
  } else {
    rowSizes = circularRows(logos.length, maxPerRow)
  }

  // Slice the flat logo list into rows, tracking each logo's global index.
  const rows: { logo: LogoItem; index: number }[][] = []
  let cursor = 0
  for (const size of rowSizes) {
    rows.push(logos.slice(cursor, cursor + size).map((logo, k) => ({ logo, index: cursor + k })))
    cursor += size
  }

  const renderTile = (logo: LogoItem, index: number) => (
    <div
      key={logo._id}
      className="pl-cell"
      style={{ animationDelay: `${Math.min(index * 0.06, 0.9)}s` }}
    >
      <div className="pl-float" style={{ animationDelay: `${(index % 5) * -1.2}s` }}>
        <div className="pl-item">
          <div
            className="pl-tile"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(uniform
                ? { width: squareSize, height: squareSize, padding: `${squarePad}px`, borderRadius: 18 }
                : { padding: `${pad}px ${Math.round(pad * 1.4)}px`, borderRadius: 999 }),
              background: '#ffffff',
              border: light ? '1px solid rgba(12,25,41,0.14)' : '1px solid rgba(220,240,250,0.35)',
              boxShadow: light
                ? '0 4px 14px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.7)'
                : '0 6px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            <img
              src={logo.url as string}
              alt={logo.name}
              draggable={false}
              style={
                uniform
                  ? {
                      maxWidth: squareSize - squarePad * 2,
                      maxHeight: squareSize - squarePad * 2,
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }
                  : {
                      height: logoH,
                      width: 'auto',
                      maxWidth: cell - pad * 2,
                      objectFit: 'contain',
                      display: 'block',
                    }
              }
            />
          </div>
          {logo.name && <span className="pl-name">{logo.name}</span>}
        </div>
      </div>
    </div>
  )

  return (
    <div ref={measureRef} className={light ? 'pl-light' : undefined} style={{ width: '100%' }}>
      <style>{`
        @keyframes plIn {
          from { opacity: 0; transform: translateY(16px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes plFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .pl-cluster { display: flex; flex-direction: column; align-items: center; }
        .pl-row { display: flex; justify-content: center; flex-wrap: nowrap; }
        .pl-cell { opacity: 0; animation: plIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
        .pl-float { animation: plFloat 6s ease-in-out infinite; }
        .pl-item { position: relative; }
        .pl-tile {
          transition: transform 0.32s cubic-bezier(0.2, 0.7, 0.2, 1),
                      box-shadow 0.32s ease, border-color 0.32s ease, opacity 0.32s ease;
        }
        .pl-cluster:has(.pl-item:hover) .pl-tile { opacity: 0.5; }
        .pl-cluster .pl-item:hover .pl-tile {
          opacity: 1;
          transform: translateY(-6px) scale(1.06);
          box-shadow: 0 14px 34px rgba(0,0,0,0.4);
          border-color: rgba(150,191,207,0.9);
        }
        .pl-light .pl-item:hover .pl-tile {
          box-shadow: 0 12px 28px rgba(0,0,0,0.14);
          border-color: rgba(59,143,170,0.85);
        }
        .pl-name {
          position: absolute;
          left: 50%;
          top: calc(100% + 8px);
          transform: translate(-50%, -4px);
          white-space: nowrap;
          font-size: 12px;
          letter-spacing: 0.02em;
          color: #DCF0F8;
          background: rgba(12, 25, 41, 0.94);
          border: 1px solid rgba(150, 191, 207, 0.35);
          padding: 4px 10px;
          border-radius: 8px;
          opacity: 0;
          pointer-events: none;
          z-index: 5;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
          transition: opacity 0.28s ease, transform 0.28s ease;
        }
        .pl-item:hover .pl-name { opacity: 1; transform: translate(-50%, 0); }
        @media (prefers-reduced-motion: reduce) {
          .pl-cell { opacity: 1; animation: none; }
          .pl-float { animation: none; }
          .pl-tile, .pl-name { transition: none; }
        }
      `}</style>

      {logos.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: light ? 'rgba(12,25,41,0.4)' : 'rgba(220,240,250,0.45)', fontSize: 14 }}>
          {emptyLabel}
        </div>
      ) : (
        <div className="pl-cluster" style={{ gap, padding: '4px 0' }}>
          {rows.map((row, r) => (
            <div key={r} className="pl-row" style={{ gap }}>
              {row.map(({ logo, index }) => renderTile(logo, index))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
