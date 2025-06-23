import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png' // confirm or update the path

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/our-work', label: 'Our Work' },
  { to: '/meet-the-team', label: 'Team' },
  { to: '/application', label: 'Apply' }
]

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-[#F1EDEE]">
      {/* <div className="max-w-7xl mx-auto px-6 sm:px-8"> */}
      <div className="">
        <nav className="flex items-center h-20 px-4 sm:px-6 w-full">
          {/* Left Logo */}
          <div className="pt-3 pb-2">
            <NavLink to="/" className="flex items-center max-w-[170px]">
              <img src={logo} alt="Apex Fund Logo" className="w-auto" />
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-base ml-8">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `relative text-[#121212] transition-colors hover:text-[#96BFCF]
                  after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px]
                  ${isActive ? 'after:bg-[#96BFCF]' : 'after:bg-transparent'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#121212] ml-auto"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden pt-6 pl-6 pr-4 pb-4 space-y-4 text-sm">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                          `relative block w-max text-[#121212] transition-colors hover:text-[#96BFCF]
                          after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px]
                          ${isActive ? 'after:bg-[#96BFCF]' : 'after:bg-transparent'}`
                }

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