/**
 * Loading Component
 */
import React from 'react';

export const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4 h-14 w-14">
        <div className="absolute inset-0 rounded-full border border-blue-100 bg-white/80 shadow-[0_12px_34px_rgba(37,99,235,0.14)] dark:border-slate-700 dark:bg-slate-950/75"></div>
        <div className="absolute inset-[5px] rounded-full border-4 border-blue-100/80 dark:border-slate-700"></div>
        <div className="absolute inset-[5px] animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-teal-500"></div>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
};

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-blue-100/90 text-blue-800 dark:bg-blue-500/10 dark:text-blue-200',
    success: 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200',
    warning: 'bg-amber-100/90 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200',
    error: 'bg-rose-100/90 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200',
    gray: 'bg-slate-100/90 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <svg
      className={`${sizes[size]} animate-spin text-blue-600`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};
