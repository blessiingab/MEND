/**
 * Card Component
 */
import React from 'react';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6
        ${hoverable ? 'hover:shadow-lg dark:hover:shadow-xl transition duration-200 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);
