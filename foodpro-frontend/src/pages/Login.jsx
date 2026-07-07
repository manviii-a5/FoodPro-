import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Login({ darkMode, setDarkMode }) {
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <button className="bg-green-600 text-white w-full font-semibold py-3.5 rounded-xl text-base hover:bg-green-700 transition">
              Sign In
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Don't have an account?
              <span className="text-green-600 font-medium"> Contact your admin</span>
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Login