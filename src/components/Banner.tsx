'use client';
// src/components/Banner.tsx

export function Banner({
  kind,
  message,
  actionLabel,
  onAction
}: {
  kind: 'error' | 'notice';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className={`banner ${kind === 'error' ? 'banner-error' : 'banner-notice'}`} role="status">
      <span>{message}</span>
      {actionLabel && onAction && (
        <button className="banner-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
