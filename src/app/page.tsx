"use client";
import { useState } from "react";
import AppFrame, { MainTab } from "@/components/AppFrame";
import LiveView from "@/components/views/LiveView";
import TodayView from "@/components/views/TodayView";
import FixturesView from "@/components/views/FixturesView";
import StandingsView from "@/components/views/StandingsView";
import LeagueView from "@/components/views/LeagueView";
import MatchDetail from "@/components/views/MatchDetail";
import { useScores } from "@/lib/useScores";
interface LeagueContext { id: number; name: string; logo: string; country?: string; }
export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("live");
  const [league, setLeague] = useState<LeagueContext | null>(null);
  const [matchId, setMatchId] = useState<number | null>(null);
  const { matches, loading, error } = useScores({ date: new Date().toISOString().split("T")[0] });

  if (matchId) return (
    <AppFrame activeTab={activeTab} onTabChange={setActiveTab}>
      <MatchDetail matchId={matchId} onBack={() => setMatchId(null)} />
    </AppFrame>
  );

  if (league) return (
    <AppFrame activeTab={activeTab} onTabChange={setActiveTab}>
      <LeagueView league={league} season={2024} onBack={() => setLeague(null)} />
    </AppFrame>
  );

  return (
    <AppFrame activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "live" && <LiveView matches={matches} loading={loading} error={error} onLeagueClick={setLeague} />}
      {activeTab === "today" && <TodayView matches={matches} loading={loading} error={error} onLeagueClick={setLeague} />}
      {activeTab === "fixtures" && <FixturesView onOpenMatch={(id) => setMatchId(id)} />}
      {activeTab === "standings" && <StandingsView />}
    </AppFrame>
  );
}
