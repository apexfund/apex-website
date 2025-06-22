import React from 'react'
import { NavLink } from 'react-router-dom'
import './components.css'

const Header = () => (
  <header>
    <nav className="header-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'} end>
        Home
      </NavLink>
      <NavLink to="/meet-the-team" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
        Meet The Team
      </NavLink>
      <NavLink to="/our-work" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
        Our Work
      </NavLink>
      <NavLink to="/application" className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}>
        Application
      </NavLink>
    </nav>
  </header>
)

export default Header
