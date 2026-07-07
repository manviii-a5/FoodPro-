import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function About({ darkMode, setDarkMode }) {
  return (
    <div>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <section className="bg-gradient-to-br from-green-50 via-green-100 to-white px-5 pt-20 pb-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-4">
            Why FoodPro exists
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            A project built during TBI-GEU SIP 2026 to solve a real content
            bottleneck for HimShakti, a food processing cooperative in Uttarakhand.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-bold text-2xl text-gray-900 mb-4">The Problem</h2>
          <p className="text-gray-500 leading-relaxed">
            HimShakti wants to list its artisan food products on Amazon but writing
            compelling keyword-rich descriptions at scale requires copywriting
            expertise the team does not have.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl text-gray-900 mb-4">The Solution</h2>
          <p className="text-gray-500 leading-relaxed">
            FoodPro takes basic product details as input and uses the Gemini AI API
            to produce a polished platform-ready description in under 5 seconds.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-2xl text-gray-900 mb-4">Tech Stack</h2>
          <ul className="text-gray-500 text-sm space-y-2">
            <li>Frontend: React + Vite</li>
            <li>Styling: Tailwind CSS</li>
            <li>Backend: FastAPI (Python)</li>
            <li>AI: Gemini API (free tier)</li>
            <li>Database: MongoDB</li>
            <li>Deployment: Vercel + Render</li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-2xl text-gray-900 mb-4">Internship Track</h2>
          <p className="text-gray-500 leading-relaxed">
            This project is part of the AI-Assisted Full Stack Web Development
            Track under TBI-GEU SIP 2026. Project code: AI-02 Food Processing.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About