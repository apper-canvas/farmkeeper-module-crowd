import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [], 
  className = '', 
  required = false,
  disabled = false,
  placeholder = 'Select an option',
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
      
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={`
            input-field appearance-none pr-10
            ${error ? 'border-error focus:ring-error' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <ApperIcon 
          name="ChevronDown" 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select