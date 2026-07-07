/**
 * Input component
 * @param {string} label - label text above input
 * @param {string} type - "text" | "email" | "password"
 * @param {string} placeholder - placeholder text
 * @param {string} value - input value
 * @param {function} onChange - change handler
 * @param {string} error - error message to display
 */

function Input({ label, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">

      {/* Label */}
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* Input field */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition
          ${error
            ? 'border-red-400 focus:ring-red-300'
            : 'border-gray-200 focus:ring-green-400'
          }`}
      />

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

    </div>
  )
}

export default Input