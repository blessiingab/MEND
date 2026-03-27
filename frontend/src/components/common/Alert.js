/**
 * Alert Component
 */
import React, { useState, useEffect } from 'react';

export const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  dismissible = true,
  autoClose = false,
  autoCloseDuration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  if (!isVisible) return null;

  const types = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-800 dark:text-blue-200', icon: '🔵' },
    success: { bg: 'bg-green-50 dark:bg-green-900', border: 'border-green-200 dark:border-green-700', text: 'text-green-800 dark:text-green-200', icon: '✓' },
    warning: { bg: 'bg-yellow-50 dark:bg-yellow-900', border: 'border-yellow-200 dark:border-yellow-700', text: 'text-yellow-800 dark:text-yellow-200', icon: '⚠' },
    error: { bg: 'bg-red-50 dark:bg-red-900', border: 'border-red-200 dark:border-red-700', text: 'text-red-800 dark:text-red-200', icon: '✕' }
  };

  const style = types[type];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <span className="text-xl mr-3">{style.icon}</span>
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>}
          <p className={style.text}>{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className={`ml-3 ${style.text} hover:opacity-70`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
