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
        <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full rounded-2xl border px-4 py-3.5 text-slate-900 dark:text-white
          bg-white/92 dark:bg-slate-950/78
          shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)]
          transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500
          focus:outline-none focus:ring-4
          ${error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
            : 'border-slate-200/90 dark:border-slate-700/90 focus:border-blue-500 focus:ring-blue-500/15'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs font-medium text-rose-500 dark:text-rose-300">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
