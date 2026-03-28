/**
 * Button Component
 */
import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-2xl transition duration-300 flex items-center justify-center gap-2 transform-gpu focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-[0.99]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 hover:brightness-105 text-white shadow-[0_16px_36px_rgba(37,99,235,0.28)] disabled:bg-gray-400 dark:disabled:bg-gray-600',
    secondary: 'bg-white/88 hover:bg-white dark:bg-slate-900/82 dark:hover:bg-slate-900 text-gray-900 dark:text-gray-100 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_12px_28px_rgba(15,23,42,0.08)]',
    danger: 'bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-105 text-white shadow-[0_16px_36px_rgba(220,38,38,0.22)] disabled:bg-gray-400 dark:disabled:bg-gray-600',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-105 text-white shadow-[0_16px_36px_rgba(5,150,105,0.24)] disabled:bg-gray-400 dark:disabled:bg-gray-600',
    outline: 'border border-blue-300 dark:border-blue-500/60 text-blue-700 dark:text-blue-300 bg-white/60 dark:bg-slate-950/40 hover:bg-blue-50 dark:hover:bg-slate-900 disabled:border-gray-400 dark:disabled:border-gray-600 disabled:text-gray-400'
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-4.5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'cursor-not-allowed opacity-70' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
