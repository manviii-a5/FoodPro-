function Card({ icon, title, description, tag }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center mb-4">
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

      {/* Tag */}
      <span className="inline-block mt-4 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
        {tag}
      </span>

    </div>
  )
}

export default Card