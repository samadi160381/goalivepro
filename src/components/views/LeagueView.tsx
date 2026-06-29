"use client";
import { useState, useEffect } from "react";
import { UiMatch } from "@/lib/types";
import { useLeagueFixtures } from "@/lib/useLeagueFixtures";
interface League { id: number; name: string; logo: string; country?: string; }
interface Props { league: League; season?: number | string; onBack?: () => void; }
type SubTab = "summary" | "results" | "fixtures" | "standings";
function statusLabel(m: UiMatch): string { if (m.status === "ft") return "FT"; if (m.status === "ht") return "HT"; if (m.status === "live") return m.minute ? `${m.minute}'` : "LIVE"; return new Date(m.kickoffIso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }); }
function MatchCard({ m }: { m: UiMatch }) { const live = m.status === "live" || m.status === "ht"; return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #2a2a2a", gap: 8 }}><div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "flex-end" }}><span style={{ fontSize: 14 }}>{m.home.name}</span><img src={m.home.logo} alt="" width={20} height={20} style={{ objectFit: "contain" }} /></div><div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64 }}>{m.homeScore !== null && m.awayScore !== null ? <span style={{ fontSize: 18, fontWeight: 700, color: live ? "#22c55e" : "inherit" }}>{m.homeScore} – {m.awayScore}</span> : <span style={{ color: "#888" }}>vs</span>}<span style={{ fontSize: 11, color: live ? "#22c55e" : "#888" }}>{statusLabel(m)}</span></div><div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}><img src={m.away.logo} alt="" width={20} height={20} style={{ objectFit: "contain" }} /><span style={{ fontSize: 14 }}>{m.away.name}</span></div></div>; }
function StandingsTab({ leagueId, season }: { leagueId: number; season: number | string }) {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch(`/api/standings?league=${leagueId}&season=${season}`).then(r => r.json()).then(data => setRows(data.standings?.[0] ?? data.response?.[0]?.league?.standings?.[0] ?? [])).catch(() => {}); }, [leagueId, season]);
  if (rows.length === 0) return <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>No standings available.</div>;
  return <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ color: "#888", fontSize: 10, textTransform: "uppercase" }}><th style={{ padding: "8px 6px" }}>#</th><th style={{ padding: "8px 6px", textAlign: "left" }}>Team</th><th style={{ padding: "8px 6px" }}>P</th><th style={{ padding: "8px 6px" }}>W</th><th style={{ padding: "8px 6px" }}>D</th><th style={{ padding: "8px 6px" }}>L</th><th style={{ padding: "8px 6px" }}>GD</th><th style={{ padding: "8px 6px", fontWeight: 700 }}>Pts</th></tr></thead><tbody>{rows.map((r: any) => <tr key={r.team.id} style={{ borderBottom: "1px solid #2a2a2a" }}><td style={{ padding: "8px 6px", textAlign: "center", color: "#888" }}>{r.rank}</td><td style={{ padding: "8px 6px" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><img src={r.team.logo} alt="" width={18} height={18} style={{ objectFit: "contain" }} />{r.team.name}</div></td><td style={{ padding: "8px 6px", textAlign: "center" }}>{r.all?.played ?? 0}</td><td style={{ padding: "8px 6px", textAlign: "center" }}>{r.all?.win ?? 0}</td><td style={{ padding: "8px 6px", textAlign: "center" }}>{r.all?.draw ?? 0}</td><td style={{ padding: "8px 6px", textAlign: "center" }}>{r.all?.lose ?? 0}</td><td style={{ padding: "8px 6px", textAlign: "center" }}>{r.goalsDiff > 0 ? `+${r.goalsDiff}` : r.goalsDiff}</td><td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700 }}>{r.points}</td></tr>)}</tbody></table></div>;
}
export default function LeagueView({ league, season = 2024, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<SubTab>("summary");
  const { upcoming, results, live, loading, error, refresh } = useLeagueFixtures(league.id, season);
  const tabs: { key: SubTab; label: string }[] = [{ key: "summary", label: "Summary" }, { key: "results", label: "Results" }, { key: "fixtures", label: "Fixtures" }, { key: "standings", label: "Standings" }];
  return <div style={{ minHeight: "100vh" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid #2a2a2a", background: "#111" }}>
      {onBack && <button onClick={onBack} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 18 }}>←</button>}
      {league.logo && <img src={league.logo} alt="" width={28} height={28} style={{ objectFit: "contain" }} />}
      <div><div style={{ fontWeight: 700, fontSize: 15 }}>{league.name}</div>{league.country && <div style={{ fontSize: 11, color: "#888" }}>{league.country}</div>}</div>
    </div>
    <div role="tablist" style={{ display: "flex", borderBottom: "1px solid #2a2a2a", background: "#111" }}>
      {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: "10px 4px", fontSize: 13, fontWeight: activeTab === t.key ? 700 : 400, background: "none", border: "none", borderBottom: activeTab === t.key ? "2px solid #3b82f6" : "2px solid transparent", color: activeTab === t.key ? "#3b82f6" : "#888", cursor: "pointer" }}>{t.label}</button>)}
    </div>
    <div>
      {loading && <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>Loading…</div>}
      {!loading && error && <div style={{ padding: "32px 20px", textAlign: "center", color: "#888" }}>⚠ {error} <button onClick={refresh} style={{ marginLeft: 8, padding: "4px 12px", border: "1px solid #2a2a2a", background: "none", color: "inherit", cursor: "pointer" }}>Retry</button></div>}
      {!loading && !error && <>
        {activeTab === "summary" && <div>{live.length > 0 && <><div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#22c55e", background: "#1a1a1a" }}>🟢 Live</div>{live.map(m => <MatchCard key={m.id} m={m} />)}</>}{results.slice(0, 5).length > 0 && <><div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#888", background: "#1a1a1a" }}>Recent Results</div>{results.slice(0, 5).map(m => <MatchCard key={m.id} m={m} />)}</>}{upcoming.slice(0, 5).length > 0 && <><div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#888", background: "#1a1a1a" }}>Upcoming</div>{upcoming.slice(0, 5).map(m => <MatchCard key={m.id} m={m} />)}</>}{live.length === 0 && results.length === 0 && upcoming.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>No matches found.</div>}</div>}
        {activeTab === "results" && (results.length === 0 ? <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>No results yet.</div> : results.map(m => <MatchCard key={m.id} m={m} />))}
        {activeTab === "fixtures" && (upcoming.length === 0 ? <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>No upcoming fixtures.</div> : upcoming.map(m => <MatchCard key={m.id} m={m} />))}
        {activeTab === "standings" && <StandingsTab leagueId={league.id} season={season} />}
      </>}
    </div>
  </div>;
}
