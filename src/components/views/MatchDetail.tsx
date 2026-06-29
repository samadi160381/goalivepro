"use client";
import { useState, useEffect } from "react";

interface Props {
  matchId: number;
  onBack: () => void;
}

type SubTab = "overview" | "timeline" | "lineups" | "stats";

export default function MatchDetail({ matchId, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<SubTab>("overview");
  const [fixture, setFixture] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [lineups, setLineups] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/fixture/${matchId}/events`).then(r => r.json()).catch(() => ({ events: [] })),
      fetch(`/api/fixture/${matchId}/lineups`).then(r => r.json()).catch(() => ({ lineups: [] })),
      fetch(`/api/fixture/${matchId}/statistics`).then(r => r.json()).catch(() => ({ statistics: [] })),
      fetch(`/api/scores?id=${matchId}`).then(r => r.json()).catch(() => ({ matches: [] })),
    ]).then(([evData, luData, stData, fxData]) => {
      setEvents(evData.events ?? evData.response ?? []);
      setLineups(luData.lineups ?? luData.response ?? []);
      setStats(stData.statistics ?? stData.response ?? []);
      const matches = fxData.matches ?? fxData.fixtures ?? fxData.response ?? [];
      if (matches[0]) setFixture(matches[0]);
      setLoading(false);
    });
  }, [matchId]);

  const home = fixture?.home ?? fixture?.homeTeam ?? { name: "Home", logo: "" };
  const away = fixture?.away ?? fixture?.awayTeam ?? { name: "Away", logo: "" };
  const homeScore = fixture?.homeScore ?? 0;
  const awayScore = fixture?.awayScore ?? 0;
  const isLive = fixture?.status === "live" || fixture?.status === "ht";
  const minute = fixture?.minute;

  const tabs: { key: SubTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "timeline", label: "Timeline" },
    { key: "lineups", label: "Lineups" },
    { key: "stats", label: "Stats" },
  ];

  function eventIcon(type: string, detail: string): string {
    if (type === "Goal") return detail?.includes("Penalty") ? "⚽ P" : detail?.includes("Own") ? "⚽ OG" : "⚽";
    if (type === "Card") return detail?.includes("Yellow") ? "🟨" : "🟥";
    if (type === "subst") return "🔄";
    return "•";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #0d1b35 0%, #0a0f1e 100%)", padding: "16px 20px 0", borderBottom: "1px solid #1e3a5f" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back
        </button>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>Loading match…</div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 20, gap: 12 }}>
            {/* Home */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
              <img src={home.logo} alt={home.name} width={56} height={56} style={{ objectFit: "contain" }} />
              <span style={{ fontSize: 15, fontWeight: 700, textAlign: "center", color: "#e2e8f0" }}>{home.name}</span>
            </div>

            {/* Score */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {isLive && (
                <div style={{ background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 4, letterSpacing: 1, animation: "pulse 1.5s infinite" }}>
                  LIVE {minute ? `${minute}'` : ""}
                </div>
              )}
              <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: 4, color: "#fff" }}>
                {homeScore} <span style={{ color: "#1e3a5f" }}>:</span> {awayScore}
              </div>
              <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>
                {fixture?.status === "ft" ? "Full Time" : fixture?.status === "ht" ? "Half Time" : fixture?.status === "scheduled" ? new Date(fixture.kickoffIso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : fixture?.status ?? ""}
              </div>
            </div>

            {/* Away */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
              <img src={away.logo} alt={away.name} width={56} height={56} style={{ objectFit: "contain" }} />
              <span style={{ fontSize: 15, fontWeight: 700, textAlign: "center", color: "#e2e8f0" }}>{away.name}</span>
            </div>
          </div>
        )}

        {/* Goal scorers */}
        {events.filter(e => e.type === "Goal").length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, fontSize: 11, color: "#94a3b8" }}>
            <div style={{ flex: 1 }}>
              {events.filter(e => e.type === "Goal" && e.team?.id === (fixture?.home?.id ?? fixture?.homeTeam?.id)).map((e, i) => (
                <div key={i}>⚽ {e.player?.name} {e.time?.elapsed}'</div>
              ))}
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {events.filter(e => e.type === "Goal" && e.team?.id !== (fixture?.home?.id ?? fixture?.homeTeam?.id)).map((e, i) => (
                <div key={i}>{e.player?.name} {e.time?.elapsed}' ⚽</div>
              ))}
            </div>
          </div>
        )}

        {/* Sub tabs */}
        <div role="tablist" style={{ display: "flex" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: "10px 4px", fontSize: 12, fontWeight: activeTab === t.key ? 700 : 400, background: "none", border: "none", borderBottom: activeTab === t.key ? "2px solid #2563eb" : "2px solid transparent", color: activeTab === t.key ? "#60a5fa" : "#475569", cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px" }}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            {events.length === 0 && stats.length === 0 ? (
              <div style={{ textAlign: "center", color: "#475569", padding: "40px 0" }}>No data available yet.</div>
            ) : (
              <>
                {/* Recent events */}
                {events.slice(0, 6).map((e, i) => {
                  const isHome = e.team?.id === (fixture?.home?.id ?? fixture?.homeTeam?.id);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #0d1b35", justifyContent: isHome ? "flex-start" : "flex-end" }}>
                      {isHome && <span style={{ fontSize: 11, color: "#64748b", minWidth: 28 }}>{e.time?.elapsed}'</span>}
                      <span style={{ fontSize: 16 }}>{eventIcon(e.type, e.detail)}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{e.player?.name}</div>
                        {e.assist?.name && <div style={{ fontSize: 11, color: "#64748b" }}>Assist: {e.assist.name}</div>}
                      </div>
                      {!isHome && <span style={{ fontSize: 11, color: "#64748b", minWidth: 28, textAlign: "right" }}>{e.time?.elapsed}'</span>}
                    </div>
                  );
                })}

                {/* Top stats */}
                {stats.length >= 2 && (
                  <div style={{ marginTop: 20 }}>
                    {[["Ball Possession", "Ball Possession"], ["Total Shots", "Total Shots"], ["Shots on Goal", "Shots on Goal"], ["Corner Kicks", "Corner Kicks"], ["Fouls", "Fouls"]].map(([label, key]) => {
                      const hStat = stats[0]?.statistics?.find((s: any) => s.type === key);
                      const aStat = stats[1]?.statistics?.find((s: any) => s.type === key);
                      const hVal = hStat?.value ?? "0";
                      const aVal = aStat?.value ?? "0";
                      const hNum = parseInt(String(hVal)) || 0;
                      const aNum = parseInt(String(aVal)) || 0;
                      const total = hNum + aNum || 1;
                      return (
                        <div key={key} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: "#e2e8f0" }}>{hVal}</span>
                            <span>{label}</span>
                            <span style={{ fontWeight: 700, color: "#e2e8f0" }}>{aVal}</span>
                          </div>
                          <div style={{ height: 4, background: "#1e3a5f", borderRadius: 2, overflow: "hidden", display: "flex" }}>
                            <div style={{ width: `${(hNum / total) * 100}%`, background: "#2563eb", borderRadius: 2, transition: "width 0.5s" }} />
                            <div style={{ width: `${(aNum / total) * 100}%`, background: "#f59e0b", borderRadius: 2, transition: "width 0.5s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TIMELINE */}
        {activeTab === "timeline" && (
          <div>
            {events.length === 0 ? <div style={{ textAlign: "center", color: "#475569", padding: "40px 0" }}>No events yet.</div> : events.map((e, i) => {
              const isHome = e.team?.id === (fixture?.home?.id ?? fixture?.homeTeam?.id);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #0d1b35", gap: 12 }}>
                  <span style={{ fontSize: 11, color: "#64748b", minWidth: 32, textAlign: "right" }}>{e.time?.elapsed}'</span>
                  <span style={{ fontSize: 18 }}>{eventIcon(e.type, e.detail)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{e.player?.name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{isHome ? home.name : away.name}{e.assist?.name ? ` · Assist: ${e.assist.name}` : ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LINEUPS */}
        {activeTab === "lineups" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {lineups.length === 0 ? <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#475569", padding: "40px 0" }}>Lineups not available yet.</div> : lineups.map((team: any, ti: number) => (
              <div key={ti}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{team.team?.name} · {team.formation}</div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 4, textTransform: "uppercase" }}>Starting XI</div>
                  {team.startXI?.map((p: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #0d1b35" }}>
                      <span style={{ fontSize: 10, color: "#475569", minWidth: 20, textAlign: "center" }}>{p.player?.number}</span>
                      <span style={{ fontSize: 13, color: "#e2e8f0" }}>{p.player?.name}</span>
                      <span style={{ fontSize: 10, color: "#64748b", marginLeft: "auto" }}>{p.player?.pos}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 4, textTransform: "uppercase" }}>Substitutes</div>
                  {team.substitutes?.map((p: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #0d1b35" }}>
                      <span style={{ fontSize: 10, color: "#475569", minWidth: 20, textAlign: "center" }}>{p.player?.number}</span>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{p.player?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATS */}
        {activeTab === "stats" && (
          <div>
            {stats.length < 2 ? <div style={{ textAlign: "center", color: "#475569", padding: "40px 0" }}>Stats not available yet.</div> : stats[0]?.statistics?.map((s: any, i: number) => {
              const aStat = stats[1]?.statistics?.[i];
              const hVal = s.value ?? "0";
              const aVal = aStat?.value ?? "0";
              const hNum = parseInt(String(hVal)) || 0;
              const aNum = parseInt(String(aVal)) || 0;
              const total = hNum + aNum || 1;
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: "#e2e8f0" }}>{hVal}</span>
                    <span>{s.type}</span>
                    <span style={{ fontWeight: 700, color: "#e2e8f0" }}>{aVal}</span>
                  </div>
                  <div style={{ height: 4, background: "#1e3a5f", borderRadius: 2, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${(hNum / total) * 100}%`, background: "#2563eb", transition: "width 0.5s", borderRadius: 2 }} />
                    <div style={{ width: `${(aNum / total) * 100}%`, background: "#f59e0b", transition: "width 0.5s", borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
