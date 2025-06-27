import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  required = false,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={`
          input-field
          ${error ? 'border-error focus:ring-error' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input