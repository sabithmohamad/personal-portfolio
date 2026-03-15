import { useId } from 'react';

interface SabithMarkIconProps {
  animated?: boolean;
  className?: string;
}

export function SabithMarkIcon({ animated = false, className = 'h-7 w-7' }: SabithMarkIconProps) {
  const gradientId = useId().replace(/:/g, '');
  const panelId = `${gradientId}-panel`;
  const haloId = `${gradientId}-halo`;
  const ribbonId = `${gradientId}-ribbon`;

  return (
    <svg
      aria-hidden="true"
      className={`sabith-mark-svg ${animated ? 'sabith-mark-animated' : ''} ${className}`.trim()}
      fill="none"
      viewBox="0 0 32 32">
      <rect fill={`url(#${panelId})`} height="28" rx="9" width="28" x="2" y="2" />
      <rect height="27" opacity="0.08" rx="8.5" stroke="#F8FBFF" width="27" x="2.5" y="2.5" />
      <ellipse className="sabith-mark-halo" cx="16" cy="16" fill={`url(#${haloId})`} rx="10.5" ry="9.25" />
      <path
        className="sabith-mark-ribbon"
        d="M23.2 10.2c-1.6-1.8-4.2-2.9-7.2-2.9-4.8 0-7.8 2.2-7.8 5.4 0 2.8 2 4.3 6.1 4.9l2.1.3c2.4.4 3.4 1.1 3.4 2.5 0 1.8-1.9 3.1-5 3.1-2.4 0-4.8-.8-6.5-2.4"
        stroke={`url(#${ribbonId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path
        className="sabith-mark-sheen"
        d="M22 10.9c-1.3-1.1-3.4-1.8-5.8-1.8-3.2 0-5.3 1.2-5.3 3.2 0 1.8 1.4 2.8 4.5 3.3"
        opacity="0.74"
        stroke="#F8FBFF"
        strokeLinecap="round"
        strokeWidth="1.2"
      />

      <defs>
        <linearGradient id={panelId} x1="4" x2="28" y1="4" y2="28">
          <stop stopColor="#1A202B" />
          <stop offset="1" stopColor="#0D1015" />
        </linearGradient>
        <radialGradient id={haloId} cx="0" cy="0" gradientTransform="translate(16 16) rotate(90) scale(9.25 10.5)" gradientUnits="userSpaceOnUse" r="1">
          <stop stopColor="#DCE5FF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#DCE5FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ribbonId} x1="8" x2="24" y1="8" y2="24">
          <stop stopColor="#FBFDFF" />
          <stop offset="0.55" stopColor="#A7B7FF" />
          <stop offset="1" stopColor="#78E7F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
