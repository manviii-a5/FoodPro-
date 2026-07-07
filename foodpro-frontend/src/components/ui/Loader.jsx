/**
 * Loader component
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} text - optional loading text
 */

function Loader({ size = 'md', text = 'Loading...' }) {

  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-4',
    lg: 'w-14 h-14 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">

      {/* Spinner */}
      <div
        className={`${sizes[size]} border-green-600 border-t-transparent rounded-full animate-spin`}
      ></div>

      {/* Text */}
      {text && (
        <p className="text-sm text-gray-500 font-medium">{text}</p>
      )}

    </div>
  )
}

export default Loader