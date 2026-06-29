"use client";
import { ReactNode } from "react";
export type MainTab = "live" | "today" | "fixtures" | "standings";
interface Props { activeTab: MainTab; onTabChange: (tab: MainTab) => void; children: ReactNode; }
const TABS: { key: MainTab; label: string }[] = [{ key: "live", label: "Live" }, { key: "today", label: "Today" }, { key: "fixtures", label: "Fixtures" }, { key: "standings", label: "Standings" }];
export default function AppFrame({ activeTab, onTabChange, children }: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg, #0d0d0d)", color: "var(--text, #f1f1f1)" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #2a2a2a", background: "#111", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: 18 }}>ScorePulse</span>
        <div style={{ display: "flex", gap: 8 }}>{["EN", "FR", "AR"].map((lang) => <button key={lang} style={{ background: "none", border: "none", color: "#888", fontSize: 12, cursor: "pointer" }}>{lang}</button>)}</div>
      </header>
      <nav role="tablist" style={{ display: "flex", background: "#111", borderBottom: "1px solid #2a2a2a", position: "sticky", top: 49, zIndex: 99 }}>
        {TABS.map((t) => <button key={t.key} role="tab" onClick={() => onTabChange(t.key)} style={{ flex: 1, padding: "11px 4px", fontSize: 13, fontWeight: activeTab === t.key ? 700 : 400, background: "none", border: "none", borderBottom: activeTab === t.key ? "2px solid #3b82f6" : "2px solid transparent", color: activeTab === t.key ? "#3b82f6" : "#888", cursor: "pointer" }}>
          {t.key === "live" && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22c55e", marginRight: 5, verticalAlign: "middle" }} />}{t.label}
        </button>)}
      </nav>
      <main id="main" style={{ flex: 1 }}>{children}</main>
      <footer style={{ padding: "10px 16px", fontSize: 11, color: "#888", borderTop: "1px solid #2a2a2a", textAlign: "center" }}>Live data via API-Football</footer>
    </div>
  );
}
