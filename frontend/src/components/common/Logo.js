/**
 * Logo Component
 */
import React from 'react';

export const Logo = ({ size = 'md', showWordmark = true, className = '' }) => {
  const sizes = {
    sm: { mark: 'h-10 w-10', wordmark: 'text-lg', subtitle: 'text-[10px]' },
    md: { mark: 'h-12 w-12', wordmark: 'text-xl', subtitle: 'text-[11px]' },
    lg: { mark: 'h-20 w-20', wordmark: 'text-3xl', subtitle: 'text-xs' }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 88 88" aria-hidden="true" className={`${currentSize.mark} shrink-0`}>
        <defs>
          <linearGradient id="mendOuterGlow" x1="8" y1="10" x2="78" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="48%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="mendInnerCore" x1="18" y1="18" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fbff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="mendPulse" x1="24" y1="20" x2="64" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        <rect x="6" y="6" width="76" height="76" rx="26" fill="url(#mendOuterGlow)" />
        <rect x="14" y="14" width="60" height="60" rx="21" fill="url(#mendInnerCore)" />

        <path
          d="M28 55V33h5.4l10.6 11.8L54.6 33H60v22h-6v-12l-10 10.9L34 43v12Z"
          fill="#0f172a"
        />

        <path
          d="M24 48c4.6-10.2 10.4-16 17.8-16 5.4 0 8.7 2.8 12.4 6.5 2.8 2.8 5.3 4.5 9.8 4.5"
          fill="none"
          stroke="url(#mendPulse)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <circle cx="58.5" cy="41.5" r="4.5" fill="#14b8a6" />
      </svg>

      {showWordmark && (
        <div className="leading-none">
          <div
            className={`${currentSize.wordmark} font-black tracking-[0.2em] text-slate-900 dark:text-slate-50`}
          >
            MEND
          </div>
          <div
            className={`${currentSize.subtitle} mt-1 uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400`}
          >
            Mind. Ease. Nurture. Develop.
          </div>
        </div>
      )}
    </div>
  );
};
