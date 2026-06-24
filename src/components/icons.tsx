// src/components/icons.tsx
//
// Ported 1:1 from the original demo's app.js ICONS object, as React
// components instead of innerHTML strings.

import { SVGProps, ReactNode } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps, children: ReactNode, viewBox = '0 0 24 24') {
  const { size = 14, ...rest } = props;
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const MoonIcon = (p: IconProps) =>
  base(p, <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />);

export const SunIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  );

export const ChevronDownIcon = (p: IconProps) =>
  base(p, <polyline points="6 9 12 15 18 9" />);

export const ArrowLeftIcon = (p: IconProps) =>
  base(
    p,
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  );

export const ArrowRightIcon = (p: IconProps) =>
  base(
    p,
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  );

export const TvIcon = (p: IconProps) =>
  base(
    p,
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M17 2 12 7 7 2" />
    </>
  );

export const CalendarOffIcon = (p: IconProps) =>
  base(
    { strokeWidth: 1.6, ...p },
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="7" y1="3" x2="7" y2="7" />
      <line x1="17" y1="3" x2="17" y2="7" />
      <line x1="6" y1="14" x2="18" y2="18" />
    </>
  );

export const TrophyIcon = (p: IconProps) =>
  base(p, <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />);

export const StarIcon = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={p.size ?? 12}
    height={p.size ?? 12}
    fill="currentColor"
    aria-hidden="true"
    {...p}
  >
    <polygon points="12 2 15.1 8.6 22 9.6 17 14.6 18.2 21.5 12 18.1 5.8 21.5 7 14.6 2 9.6 8.9 8.6" />
  </svg>
);

export const ShieldIcon = (p: IconProps) =>
  base(p, <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />);

export const SubIcon = (p: IconProps) =>
  base(
    p,
    <>
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </>
  );

export const WhistleIcon = (p: IconProps) =>
  base(
    p,
    <>
      <circle cx="8" cy="16" r="5" />
      <path d="M13 16h6a3 3 0 0 0 3-3v-1M16 12V9" />
    </>
  );

export const CardIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 11} height={14} fill="currentColor" aria-hidden="true" {...p}>
    <rect x="2" y="1" width="14" height="18" rx="2" />
  </svg>
);
