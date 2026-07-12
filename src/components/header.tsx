import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

const STRIP = '#1A4A60'
const ON_STRIP = '#ffffff'
const ON_STRIP_MUTED = 'rgba(255,255,255,0.65)'

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/our-mission', label: 'About' },
  { to: '/our-work', label: 'Our Work' },
  { to: '/meet-the-team', label: 'Team' },
  { to: '/join-us', label: 'Join Us' },
]

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header style={{ backgroundColor: STRIP, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

          {/* Logo */}
          <NavLink to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', marginLeft: '8%' }}>
            <div style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img src={logo} alt="Apex Fund Logo" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
            </div>
          </NavLink>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginRight: '9%' }} className="hidden md:flex">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                style={({ isActive }) => ({
                  color: isActive ? ON_STRIP : ON_STRIP_MUTED,
                  fontSize: 14,
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  paddingBottom: 4,
                  borderBottom: isActive ? `2px solid #96BFCF` : '2px solid transparent',
                  transition: 'color 0.2s',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                {label}
              </NavLink>
            ))}

          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            style={{ color: ON_STRIP, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile drawer */}
        {isOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingBottom: 16 }}>
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '12px 0',
                  color: isActive ? ON_STRIP : ON_STRIP_MUTED,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
