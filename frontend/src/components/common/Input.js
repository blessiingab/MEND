/**
 * Input Component
 */
import React from 'react';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  fullWidth = true,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
