/**
 * Modal Component
 */
import React from 'react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = ''
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className={`${sizes[size]} w-full bg-white/92 dark:bg-slate-950/88 rounded-[28px] border border-white/70 dark:border-slate-800/80 shadow-[0_30px_80px_rgba(15,23,42,0.24)] dark:shadow-[0_30px_80px_rgba(2,6,23,0.56)] ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200/80 dark:border-slate-800/80">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-gray-900 dark:text-gray-100">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-gray-200/80 dark:border-slate-800/80 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
