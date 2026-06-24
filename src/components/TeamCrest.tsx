'use client';
// src/components/TeamCrest.tsx
//
// API-Football provides real team logo URLs (media.api-sports.io).
// We try the real logo first; if it fails to load (or there's none),
// fall back to the colored-initials disc from the original demo so
// the layout never breaks.

import { useState } from 'react';

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

export function TeamCrest({
  name,
  logo,
  size = 20,
  variant = 'list'
}: {
  name: string;
  logo?: string;
  size?: number;
  variant?: 'list' | 'detail';
}) {
  const [failed, setFailed] = useState(!logo);
  const initials = name.slice(0, 2).toUpperCase();
  const color = hashColor(name);
  const cls = variant === 'detail' ? 'detail-flag' : 'team-flag';

  if (failed || !logo) {
    return (
      <div className={cls} style={{ background: `${color}22`, borderColor: `${color}55` }}>
        <span style={{ color, fontWeight: 700, fontSize: variant === 'detail' ? 14 : 10 }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={cls}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
