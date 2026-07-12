import React, { useState } from 'react'

const ACCENT = '#96BFCF'
const NAV_BG = '#0C1929'

interface MemberCardProps {
  name: string
  role: string
  team?: string
  bio?: string
  imageUrl?: string
  linkedinUrl?: string
}

const MemberCard: React.FC<MemberCardProps> = ({ name, role, team, bio, imageUrl, linkedinUrl }) => {
  const [hovered, setHovered] = useState(false)

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '24px 16px 20px',
        border: `1px solid ${hovered ? ACCENT + '60' : 'rgba(0,0,0,0.07)'}`,
        backgroundColor: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
        transition: 'all 0.25s ease',
        cursor: linkedinUrl ? 'pointer' : 'default',
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: 14,
            filter: hovered ? 'grayscale(0%)' : 'grayscale(40%)',
            transition: 'filter 0.25s ease',
          }}
        />
      ) : (
        <div style={{ width: 76, height: 76, borderRadius: '50%', backgroundColor: '#D6E8EF', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 600, color: '#4A8FAA', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em', userSelect: 'none' }}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      <p style={{ fontSize: 14, fontWeight: 600, color: NAV_BG, margin: '0 0 4px 0', lineHeight: 1.3 }}>
        {name}
      </p>
      <p style={{ fontSize: 12, color: ACCENT, fontWeight: 500, margin: '0 0 3px 0', letterSpacing: '0.02em' }}>
        {role}
      </p>
      {team && (
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 2px 0' }}>
          {team}
        </p>
      )}
      {bio && (
        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 8, lineHeight: 1.6 }}>
          {bio}
        </p>
      )}
      {linkedinUrl && (
        <p style={{ fontSize: 11, color: hovered ? ACCENT : '#D1D5DB', marginTop: 10, transition: 'color 0.2s' }}>
          LinkedIn →
        </p>
      )}
    </div>
  )

  return linkedinUrl ? (
    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
      {card}
    </a>
  ) : (
    card
  )
}

export default MemberCard
