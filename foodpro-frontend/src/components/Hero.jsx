import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-green-100 to-white px-5 pt-20 pb-24 text-center">
      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <h1 className="font-extrabold text-4xl md:text-6xl text-gray-900 leading-tight mb-5">
          Write product listings
          <br />
          <span className="text-green-600">in seconds, not hours.</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
          FoodPro uses AI to generate keyword-rich, e-commerce-ready product
          descriptions for HimShakti's food products — instantly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="bg-green-600 text-white font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-green-700 transition"
          >
            Generate a Description →
          </Link>
          <Link
            to="/about"
            className="border border-gray-200 text-gray-700 font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-gray-50 transition"
          >
            Learn More
          </Link>
        </div>

      </div>

      {/* Stats Bar */}
      <div className="max-w-2xl mx-auto mt-16 grid grid-cols-3 gap-6 border border-green-100 rounded-2xl bg-white px-6 py-5 shadow-sm">
        <div className="text-center">
          <div className="font-bold text-2xl text-green-600">10×</div>
          <div className="text-xs text-gray-500 mt-1">Faster than manual writing</div>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="font-bold text-2xl text-green-600">3</div>
          <div className="text-xs text-gray-500 mt-1">Brand tone options</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-2xl text-green-600">100%</div>
          <div className="text-xs text-gray-500 mt-1">Free during internship</div>
        </div>
      </div>

    </section>
  )
}

export default Hero