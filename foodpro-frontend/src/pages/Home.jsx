import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Card from '../components/Card'

const features = [
  {
    icon: '📝',
    title: 'Smart Input Form',
    description: 'Enter product name, ingredients, weight and features.',
    tag: 'Core Feature',
  },
  {
    icon: '🎨',
    title: 'Tone Selector',
    description: 'Choose from Premium, Traditional or Health-Focused tone.',
    tag: 'Core Feature',
  },
  {
    icon: '🤖',
    title: 'AI Description Generator',
    description: 'Powered by Gemini API. Generates keyword-rich descriptions in seconds.',
    tag: 'AI Feature',
  },
  {
    icon: '🔄',
    title: 'Regenerate and Edit',
    description: 'Regenerate a fresh version or manually edit the output.',
    tag: 'Core Feature',
  },
  {
    icon: '📚',
    title: 'Sample Library',
    description: '10 pre-generated descriptions across HimShakti product range.',
    tag: 'Core Feature',
  },
  {
    icon: '💾',
    title: 'Save History',
    description: 'All generated descriptions are saved in your account.',
    tag: 'Coming Soon',
  },
]

function Home({ darkMode, setDarkMode }) {
  return (
    <div>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />

      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900">
            Everything HimShakti needs
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Built for food processing brands that sell on Amazon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tag={feature.tag}
            />
          ))}
        </div>
      </section>

      <section className="bg-green-600 py-14 px-5 text-center">
        <h2 className="font-bold text-white text-2xl md:text-3xl mb-3">
          Ready to write better listings?
        </h2>
        <p className="text-green-100 mb-7 max-w-md mx-auto">
          Start generating AI-powered descriptions today.
        </p>
        <a
          href="/dashboard"
          className="bg-white text-green-700 font-bold px-8 py-3.5 rounded-xl hover:bg-green-50 transition text-base"
        >
          Open Dashboard
        </a>
      </section>

      <Footer />
    </div>
  )
}

export default Home