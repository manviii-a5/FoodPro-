import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login({ darkMode, setDarkMode }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=> {
    if(localStorage.getItem('token')){
      navigate('/dashboard')
    }
  }, [navigate])
  const handleLogin = async () => {
    setError('')
    if(!email.trim() || !password.trim()){
      setError('Please enter both email and password')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Login failed')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('userEmail', data.data.email)
      navigate('/dashboard')
    } catch (err) {
      setError('Could not connect to server')
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-white flex items-center justify-center px-5 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="font-bold text-2xl text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your FoodPro account
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@himshakti.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-green-600 text-white w-full font-semibold py-3.5 rounded-xl text-base hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Don't have an account?
              <Link to="/register" className="text-green-600 font-medium"> Create one</Link>
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Login