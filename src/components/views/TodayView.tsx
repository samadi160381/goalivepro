"use client";
import { UiMatch } from "@/lib/types";
const LIVE = new Set(["live", "ht"]);
interface Props { matches: UiMatch[]; loading: boolean; error: string | null; onLeagueClick?: (l: { id: number; name: string; logo: string }) => void; }
function groupByLeague(matches: UiMatch[]): Record<string, UiMatch[]> { const g: Record<string, UiMatch[]> = {}; for (const m of matches) { const k = m.leagueName ?? "Other"; if (!g[k]) g[k] = []; g[k].push(m); } return g; }
function statusLabel(m: UiMatch): string { if (m.status === "ft") return "FT"; if (m.status === "postponed") return "PST"; if (m.status === "cancelled") return "CANC"; return new Date(m.kickoffIso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }); }
export default function TodayView({ matches, loading, error, onLeagueClick }: Props) {
  if (loading) return <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>Loading…</div>;
  if (error) return <div style={{ padding: "32px 20px", textAlign: "center", color: "#888" }}>⚠ {error}</div>;
  const nonLive = matches.filter((m) => !LIVE.has(m.status));
  if (nonLive.length === 0) return <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>No matches scheduled for today.</div>;
  const groups = groupByLeague(nonLive);
  return <div>{Object.entries(groups).map(([name, ms]) => <div key={name}><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", cursor: "pointer" }} onClick={() => onLeagueClick?.({ id: ms[0].leagueId, name, logo: "" })}><span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#3b82f6" }}>{name}</span><span style={{ marginLeft: "auto", color: "#888" }}>›</span></div>{ms.map((m) => <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #2a2a2a", gap: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "flex-end" }}><span style={{ fontSize: 14 }}>{m.home.name}</span><img src={m.home.logo} alt="" width={20} height={20} style={{ objectFit: "contain" }} /></div><div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64 }}>{m.homeScore !== null && m.awayScore !== null ? <span style={{ fontSize: 18, fontWeight: 700 }}>{m.homeScore} – {m.awayScore}</span> : <span style={{ color: "#888" }}>vs</span>}<span style={{ fontSize: 11, color: "#888" }}>{statusLabel(m)}</span></div><div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}><img src={m.away.logo} alt="" width={20} height={20} style={{ objectFit: "contain" }} /><span style={{ fontSize: 14 }}>{m.away.name}</span></div></div>)}</div>)}</div>;
}
// onMatchClick stub - accepted but handled by parent
