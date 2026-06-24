// src/lib/leagues.ts
//
// Lightweight metadata for the leagues we feature by default.
// The API already gives us league name/round per fixture; this just
// adds an icon choice consistent with the original design's
// trophy/star/shield scheme. Any league not listed here still renders
// fine — it just uses the generic shield icon.

export const FEATURED_LEAGUES: { id: number; iconKey: 'trophy' | 'star' | 'shield' }[] = [
  { id: 1, iconKey: 'trophy' }, // FIFA World Cup
  { id: 2, iconKey: 'star' }, // UEFA Champions League
  { id: 39, iconKey: 'shield' }, // Premier League
  { id: 140, iconKey: 'shield' }, // La Liga
  { id: 135, iconKey: 'shield' }, // Serie A
  { id: 78, iconKey: 'shield' }, // Bundesliga
  { id: 61, iconKey: 'shield' } // Ligue 1
];

export function iconForLeague(id: number): 'trophy' | 'star' | 'shield' {
  return FEATURED_LEAGUES.find((l) => l.id === id)?.iconKey ?? 'shield';
}
