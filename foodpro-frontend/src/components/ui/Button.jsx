/**
 * Button component
 * @param {string} variant - "primary" | "secondary" | "outline"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} disabled - disables the button
 * @param {function} onClick - click handler
 * @param {React.ReactNode} children - button text
 */

function Button({ variant = 'primary', size = 'md', disabled = false, onClick, children }) {

  const base = 'font-semibold rounded-xl transition focus:outline-none'

  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

export default Button