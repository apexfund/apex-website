import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => (
  <header>
    <nav className="flex gap-4 justify-center items-center p-4 bg-gray-900">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-white no-underline px-4 py-2 rounded transition ${isActive ? 'bg-white text-gray-900' : ''}`
        }
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/our-work"
        className={({ isActive }) =>
          `text-white no-underline px-4 py-2 rounded transition ${isActive ? 'bg-white text-gray-900' : ''}`
        }
      >
        Our Work
      </NavLink>
      <NavLink
        to="/meet-the-team"
        className={({ isActive }) =>
          `text-white no-underline px-4 py-2 rounded transition ${isActive ? 'bg-white text-gray-900' : ''}`
        }
      >
        Meet The Team
      </NavLink>
      <NavLink
        to="/application"
        className={({ isActive }) =>
          `text-white no-underline px-4 py-2 rounded transition ${isActive ? 'bg-white text-gray-900' : ''}`
        }
      >
        Application
      </NavLink>
    </nav>
  </header>
)

export default Header
