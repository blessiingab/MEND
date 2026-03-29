/**
 * Alert Component
 */
import React, { useEffect, useState } from 'react';

const ALERT_STYLES = {
  info: {
    bg: 'bg-blue-50/90 dark:bg-blue-950/45',
    border: 'border-blue-200/90 dark:border-blue-800/90',
    text: 'text-blue-900 dark:text-blue-100',
    iconBg: 'bg-blue-600/12 text-blue-700 dark:bg-blue-400/12 dark:text-blue-300',
    iconPath: 'M12 8h.01M11 12h1v4h1m-1-12a9 9 0 100 18 9 9 0 000-18z'
  },
  success: {
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/45',
    border: 'border-emerald-200/90 dark:border-emerald-800/90',
    text: 'text-emerald-900 dark:text-emerald-100',
    iconBg: 'bg-emerald-600/12 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300',
    iconPath: 'M9 12l2 2 4-4m5-1a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  warning: {
    bg: 'bg-amber-50/90 dark:bg-amber-950/45',
    border: 'border-amber-200/90 dark:border-amber-800/90',
    text: 'text-amber-900 dark:text-amber-100',
    iconBg: 'bg-amber-600/12 text-amber-700 dark:bg-amber-400/12 dark:text-amber-300',
    iconPath: 'M12 9v2m0 4h.01m-7.938 4h15.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L2.33 16c-.77 1.333.192 3 1.732 3z'
  },
  error: {
    bg: 'bg-rose-50/90 dark:bg-rose-950/45',
    border: 'border-rose-200/90 dark:border-rose-800/90',
    text: 'text-rose-900 dark:text-rose-100',
    iconBg: 'bg-rose-600/12 text-rose-700 dark:bg-rose-400/12 dark:text-rose-300',
    iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
};

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
    if (!autoClose) return undefined;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDuration, onClose]);

  if (!isVisible) return null;

  const style = ALERT_STYLES[type] || ALERT_STYLES.info;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={`${style.bg} ${style.border} mb-4 rounded-[24px] border p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_45px_rgba(2,6,23,0.28)]`}
    >
      <div className="flex items-start">
        <span className={`mr-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${style.iconBg}`}>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.iconPath} />
          </svg>
        </span>
        <div className="flex-1">
          {title && <h4 className={`mb-1 font-semibold ${style.text}`}>{title}</h4>}
          <p className={`${style.text} leading-6`}>{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className={`ml-3 rounded-full p-2 ${style.text} hover:bg-black/5 dark:hover:bg-white/5 hover:opacity-90`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
