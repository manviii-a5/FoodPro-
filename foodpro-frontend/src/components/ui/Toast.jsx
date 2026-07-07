/**
 * Toast component
 * @param {string} message - text to display
 * @param {string} type - "success" | "error" | "warning"
 * @param {boolean} isVisible - controls visibility
 * @param {function} onClose - close handler
 */

function Toast({ message, type = 'success', isVisible, onClose }) {

  if (!isVisible) return null

  const types = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-400 text-gray-900',
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg ${types[type]}`}>

        {/* Icon */}
        <span className="text-lg">{icons[type]}</span>

        {/* Message */}
        <p className="text-sm font-medium">{message}</p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="ml-2 text-sm font-bold opacity-70 hover:opacity-100"
        >
          x
        </button>

      </div>
    </div>
  )
}

export default Toast