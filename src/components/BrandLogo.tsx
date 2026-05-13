type Props = { className?: string };

// HeraLite emblem — crescent moon with a small gold sparkle
export function BrandLogo({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hl-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.22 295)" />
          <stop offset="100%" stopColor="oklch(0.18 0.05 280)" />
        </linearGradient>
      </defs>
      {/* Crescent */}
      <path
        d="M52 32a22 22 0 1 1-22-22 16 16 0 0 0 22 22z"
        fill="url(#hl-grad)"
      />
      {/* Gold sparkle */}
      <g transform="translate(40 24)">
        <path
          d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z"
          fill="oklch(0.82 0.16 80)"
        />
      </g>
    </svg>
  );
}
