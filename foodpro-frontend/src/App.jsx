import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Components from './pages/Components'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500) // shows loader for 1.5 seconds
    return () => clearTimeout(timer)
  }, [])
 
 if (loading) {
    return (
      <>
      <style>{`
        @keyframes dotFade {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
      `}</style>
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-green-600 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translate(0, -18px)`,
                  animation: 'dotFade 1s linear infinite',
                  animationDelay: `${i * 0.125}s`,
                }}
              ></div>
            ))}
          </div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading FoodPro...
          </p>
        </div>
      </div>
      </>
    )
  }
  return (
    <div className={darkMode ? 'dark bg-gray-950 min-h-screen' : 'bg-white min-h-screen'}>
      <ErrorBoundary>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
               <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/register" element={<Register darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/components" element={<Components darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  )
}