/**
 * Card Component
 */
import React from 'react';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[28px] border border-white/70 dark:border-slate-800/80
        bg-white/88 dark:bg-slate-950/76 backdrop-blur-xl
        shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(2,6,23,0.42)] p-6
        ${hoverable ? 'transition duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_28px_70px_rgba(2,6,23,0.48)]' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/80 dark:via-blue-400/40 to-transparent" />
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-5 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-5 pt-5 border-t border-gray-200/80 dark:border-slate-700/80 ${className}`}>
    {children}
  </div>
);
