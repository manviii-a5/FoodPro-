/**
 * Modal component
 * @param {boolean} isOpen - controls visibility
 * @param {function} onClose - close handler
 * @param {string} title - modal heading
 * @param {React.ReactNode} children - modal body content
 */

function Modal({ isOpen, onClose, title, children }) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      ></div>

      {/* Modal box */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            x
          </button>
        </div>

        {/* Body */}
        <div className="text-gray-600 text-sm leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

export default Modal