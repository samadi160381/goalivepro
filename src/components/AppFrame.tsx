"use client";
import { ReactNode, useState } from "react";
export type MainTab = "live" | "today" | "fixtures" | "standings";
type SportTab = "football" | "tennis" | "basketball" | "rugby" | "cricket" | "baseball";
interface Props { activeTab: MainTab; onTabChange: (tab: MainTab) => void; children: ReactNode; }
const SPORTS: { key: SportTab; label: string; icon: string }[] = [
  { key: "football", label: "Football", icon: "⚽" },
  { key: "tennis", label: "Tennis", icon: "🎾" },
  { key: "basketball", label: "Basketball", icon: "🏀" },
  { key: "rugby", label: "Rugby", icon: "🏉" },
  { key: "cricket", label: "Cricket", icon: "🏏" },
  { key: "baseball", label: "Baseball", icon: "⚾" },
];
const LEAGUES = [
  { group: "Top Leagues", items: [{ name: "Champions League", icon: "🏆" }, { name: "Premier League", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "La Liga", icon: "🇪🇸" }, { name: "Serie A", icon: "🇮🇹" }, { name: "Bundesliga", icon: "🇩" }, { name: "Ligue 1", icon: "🇫🇷" }] },
  { group: "International", items: [{ name: "World Cup 2026", icon: "🌍" }, { name: "UEFA Euro", icon: "🇪🇺" }, { name: "Copa America", icon: "🌎" }] },
  { group: "Americas", items: [{ name: "MLS", icon: "🇺🇸" }, { name: "Brasileirao", icon: "🇧🇷" }, { name: "Liga MX", icon: "🇲🇽" }] },
];
const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: "live", label: "Live" },
  { key: "today", label: "Today" },
  { key: "fixtures", label: "Fixtures" },
  { key: "standings", label: "Standings" },
];
export default function AppFrame({ activeTab, onTabChange, children }: Props) {
  const [sport, setSport] = useState<SportTab>("football");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0a0f1e", color: "#e2e8f0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0f1e; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Top header */}
      <header style={{ background: "linear-gradient(135deg, #0d1b35 0%, #0a0f1e 100%)", borderBottom: "1px solid #1e3a5f", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18, padding: "4px 8px", borderRadius: 6 }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg, #60a5fa, #e2e8f0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GoAlivePro</span>
          </div>
        </div>

        {/* Sport tabs */}
        <div style={{ display: "flex", gap: 2, background: "#0d1b35", borderRadius: 10, padding: 3, border: "1px solid #1e3a5f" }}>
          {SPORTS.map(s => (
            <button key={s.key} onClick={() => setSport(s.key)} style={{ padding: "5px 12px", borderRadius: 7, border: "none", background: sport === s.key ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "none", color: sport === s.key ? "#fff" : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: sport === s.key ? 700 : 400, display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s", whiteSpace: "nowrap" }}>
              <span>{s.icon}</span><span style={{ display: "inline" }}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["EN", "FR", "AR"].map(l => <button key={l} style={{ background: "none", border: "none", color: "#64748b", fontSize: 11, cursor: "pointer", padding: "3px 6px", borderRadius: 4 }}>{l}</button>)}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside style={{ width: 220, background: "#0d1b35", borderRight: "1px solid #1e3a5f", overflowY: "auto", flexShrink: 0, animation: "slideIn 0.2s ease" }}>
            <div style={{ padding: "12px 8px" }}>
              {LEAGUES.map(group => (
                <div key={group.group} style={{ marginBottom: 4 }}>
                  <button onClick={() => setCollapsed(c => ({ ...c, [group.group]: !c[group.group] }))} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    <span>{group.group}</span>
                    <span style={{ transition: "transform 0.2s", transform: collapsed[group.group] ? "rotate(-90deg)" : "rotate(0deg)" }}>▾</span>
                  </button>
                  {!collapsed[group.group] && group.items.map(item => (
                    <button key={item.name} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13, borderRadius: 6, textAlign: "left", transition: "all 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#1e3a5f", e.currentTarget.style.color = "#e2e8f0")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none", e.currentTarget.style.color = "#94a3b8")}>
                      <span style={{ fontSize: 15 }}>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Match tabs */}
          <div style={{ background: "#0d1b35", borderBottom: "1px solid #1e3a5f", padding: "0 20px", display: "flex", alignItems: "center", gap: 0 }}>
            {MAIN_TABS.map(t => (
              <button key={t.key} onClick={() => onTabChange(t.key)} style={{ padding: "13px 20px", background: "none", border: "none", borderBottom: activeTab === t.key ? "2px solid #2563eb" : "2px solid transparent", color: activeTab === t.key ? "#60a5fa" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: activeTab === t.key ? 700 : 400, display: "flex", alignItems: "center", gap: 6, transition: "color 0.15s" }}>
                {t.key === "live" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 1.5s infinite" }} />}
                {t.label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <main style={{ flex: 1, overflowY: "auto", padding: "0" }}>
            {sport !== "football" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "#475569", gap: 12 }}>
                <div style={{ fontSize: 48 }}>{SPORTS.find(s => s.key === sport)?.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>{SPORTS.find(s => s.key === sport)?.label} coming soon</div>
                <div style={{ fontSize: 13, color: "#334155" }}>Switch to Football for live data</div>
              </div>
            ) : children}
          </main>
        </div>
      </div>

      <footer style={{ background: "#0d1b35", borderTop: "1px solid #1e3a5f", padding: "8px 20px", fontSize: 11, color: "#334155", textAlign: "center" }}>
        Live data via API-Football · GoAlivePro © 2026
      </footer>
    </div>
  );
}
