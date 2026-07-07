import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-5 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="font-bold text-white text-base">
              Food<span className="text-green-600">Pro</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            AI-powered product description generator for food processing brands. Built for HimShakti.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            <li><Link to="/Components" className="hover:text-white transition">Components</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
          </ul>
        </div>

        {/* Project Info */}
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Project Info</h4>
          <ul className="space-y-2 text-sm">
            <li>Product: FoodPro AI</li>
            <li>Track: AI-Assisted Full Stack</li>
            <li>Features: AI product descriptions</li>
            <li>Target Users: Food brands</li>
            <li>AI: Gemini API (free tier)</li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
        © 2026 FoodPro · Built as part of TBI-GEU Summer Internship Program
      </div>
    </footer>
  )
}

export default Footer