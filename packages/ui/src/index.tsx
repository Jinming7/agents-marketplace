// Shared UI components
// This package can be expanded with reusable components

export const Button = ({ children, onClick, variant = 'primary' }: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 hover:bg-gray-50',
  }

  return (
    <button className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  )
}

export const Card = ({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`bg-white rounded-xl border p-6 ${className}`}>
    {children}
  </div>
)

export const Input = ({ placeholder, type = 'text', value, onChange }: {
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
)