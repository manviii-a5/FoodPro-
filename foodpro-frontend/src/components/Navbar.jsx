import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Components', path: '/components' },
    { name: 'Login', path: '/login' },
  ]

  return (
    <nav className={`sticky top-0 z-50 border-b shadow-sm ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Food<span className="text-green-600">Pro</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-green-600 font-semibold'
                  : darkMode ? 'text-gray-300 hover:text-green-400' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Dark/Light toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'
            }`}
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>

          <Link
            to="/dashboard"
            className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Try Free
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-0.5 block ${darkMode ? 'bg-white' : 'bg-gray-700'}`}></span>
          <span className={`w-6 h-0.5 block ${darkMode ? 'bg-white' : 'bg-gray-700'}`}></span>
          <span className={`w-6 h-0.5 block ${darkMode ? 'bg-white' : 'bg-gray-700'}`}></span>
        </button>
      </div>

      {menuOpen && (
        <div className={`md:hidden border-t px-5 py-4 flex flex-col gap-4 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => { setDarkMode(!darkMode); setMenuOpen(false) }}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'}`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar