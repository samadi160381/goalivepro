// src/components/MatchRowSkeleton.tsx
//
// Shown while real fixture data is loading. Matches the grid of a
// real match-row exactly so there's no layout jump when data arrives.

export function MatchRowSkeleton() {
  return (
    <div className="skeleton-row">
      <div className="skel-block skel-crest" />
      <div>
        <div className="skel-block skel-line" />
        <div className="skel-block skel-line" />
      </div>
      <div className="skel-block skel-score" />
    </div>
  );
}

export function MatchListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="comp-group">
      <div className="comp-header">
        <div className="skel-block skel-crest" />
        <div className="skel-block skel-line" style={{ width: 120 }} />
      </div>
      <div className="match-list">
        {Array.from({ length: rows }).map((_, i) => (
          <MatchRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
