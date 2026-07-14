import logo from '../assets/logo.png'

const STRIP = '#ffffff'
const ON_STRIP = '#000000'
const ON_STRIP_MUTED = 'rgba(0,0,0,0.5)'
const ON_STRIP_FAINT = 'rgba(0,0,0,0.35)'

const Footer = () => {
const year = new Date().getFullYear()
return (
  <footer style={{ backgroundColor: STRIP }}>
    <div style={{ backgroundColor: STRIP }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8" style={{ paddingTop: 48, paddingBottom: 56 }}>
        <div className="section-inner flex flex-col lg:flex-row lg:justify-between lg:items-start" style={{ gap: 48 }}>

          {/* Brand column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
            <img src={logo} alt="Apex Fund" style={{ height: 72, width: 'auto', maxWidth: 220, objectFit: 'contain' }} />
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 32, flex: 1 }}>
            {[
              {
                heading: 'Contact',
                links: [
                  { label: 'Email', href: 'mailto:apexfundquant@gmail.com' },
                  { label: 'TerpLink', href: 'https://terplink.umd.edu/organization/apexfund', external: true },
                ],
              },
              {
                heading: 'Get Involved',
                links: [
                  { label: 'Apply', href: '/join-us' },
                  { label: 'Interest Meeting', href: '/join-us' },
                ],
              },
              {
                heading: 'Our Team',
                links: [
                  { label: 'Executive Board', href: '/meet-the-team' },
                  { label: 'Investment Team', href: '/meet-the-team' },
                ],
              },
              {
                heading: 'Explore',
                links: [
                  { label: 'Research', href: '/our-work' },
                  { label: 'Placements', href: '/#placements' },
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4
                  style={{
                    color: ON_STRIP,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: '0 0 16px 0',
                  }}
                >
                  {col.heading}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        style={{ color: ON_STRIP_MUTED, fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = ON_STRIP)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = ON_STRIP_MUTED)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="section-inner"
          style={{
            marginTop: 48,
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span style={{ color: ON_STRIP_FAINT, fontSize: 12 }}>© {year} Apex Fund. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ color: ON_STRIP_FAINT, fontSize: 12 }}>University of Maryland, College Park</span>
            <a
              href="/admin"
              style={{ color: ON_STRIP_FAINT, fontSize: 12, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ON_STRIP)}
              onMouseLeave={(e) => (e.currentTarget.style.color = ON_STRIP_FAINT)}
            >
              Admin
            </a>
          </span>
        </div>
      </div>
    </div>
  </footer>
)
}

export default Footer
