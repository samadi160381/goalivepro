"use client";
import { UiMatch } from "@/lib/types";
const LIVE = new Set(["live", "ht"]);
interface Props { matches: UiMatch[]; loading: boolean; error: string | null; onLeagueClick?: (l: { id: number; name: string; logo: string }) => void; }
function groupByLeague(matches: UiMatch[]): Record<string, UiMatch[]> { const g: Record<string, UiMatch[]> = {}; for (const m of matches) { const k = m.leagueName ?? "Other"; if (!g[k]) g[k] = []; g[k].push(m); } return g; }
export default function LiveView({ matches, loading, error, onLeagueClick }: Props) {
  if (loading) return <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>Loading…</div>;
  if (error) return <div style={{ padding: "32px 20px", textAlign: "center", color: "#888" }}>⚠ {error}</div>;
  const live = matches.filter((m) => LIVE.has(m.status));
  if (live.length === 0) return <div style={{ padding: "48px 20px", textAlign: "center", color: "#888" }}><div style={{ fontSize: 32, marginBottom: 12 }}>⚽</div><div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No live matches right now</div><div style={{ fontSize: 13 }}>Check the Today tab for today's schedule.</div></div>;
  const groups = groupByLeague(live);
  return <div>{Object.entries(groups).map(([name, ms]) => <div key={name}><div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", cursor: "pointer" }} onClick={() => onLeagueClick?.({ id: ms[0].leagueId, name, logo: "" })}><span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#3b82f6" }}>{name}</span><span style={{ marginLeft: "auto", color: "#888" }}>›</span></div>{ms.map((m) => <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #2a2a2a", gap: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "flex-end" }}><span style={{ fontSize: 14 }}>{m.home.name}</span><img src={m.home.logo} alt="" width={20} height={20} style={{ objectFit: "contain" }} /></div><div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64 }}><span style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>{m.homeScore ?? 0} – {m.awayScore ?? 0}</span><span style={{ fontSize: 11, color: "#22c55e" }}>{m.status === "ht" ? "HT" : m.minute ? `${m.minute}'` : "LIVE"}</span></div><div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}><img src={m.away.logo} alt="" width={20} height={20} style={{ objectFit: "contain" }} /><span style={{ fontSize: 14 }}>{m.away.name}</span></div></div>)}</div>)}</div>;
}
// onMatchClick stub - accepted but handled by parent
