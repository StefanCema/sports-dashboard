import type { Match } from "../types";

const API_BASE = "/api/football";

type RawStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "POSTPONED"
  | "SUSPENDED"
  | "CANCELLED"
  | "AWARDED";

interface RawMatch {
  id: number;
  utcDate: string;
  status: RawStatus;
  minute?: number | null;
  competition: { name: string };
  homeTeam: { name: string; shortName: string | null };
  awayTeam: { name: string; shortName: string | null };
  score: {
    fullTime: { home: number | null; away: number | null };
  };
}

interface MatchesResponse {
  matches: RawMatch[];
}

const STATUS_MAP: Record<RawStatus, Match["status"] | null> = {
  SCHEDULED: "upcoming",
  TIMED: "upcoming",
  IN_PLAY: "live",
  PAUSED: "live",
  FINISHED: "finished",
  POSTPONED: null,
  SUSPENDED: null,
  CANCELLED: null,
  AWARDED: null,
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatStartTime = (kickoff: Date): string => {
  const time = kickoff.toLocaleTimeString("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isSameDay(kickoff, new Date())) return time;

  const day = kickoff.toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "short",
  });
  return `${day} ${time}`;
};

const mapMatch = (raw: RawMatch): Match | null => {
  const status = STATUS_MAP[raw.status];
  if (!status) return null;

  const kickoff = new Date(raw.utcDate);

  return {
    id: String(raw.id),
    homeTeam: raw.homeTeam.shortName ?? raw.homeTeam.name,
    awayTeam: raw.awayTeam.shortName ?? raw.awayTeam.name,
    homeScore: raw.score.fullTime.home ?? 0,
    awayScore: raw.score.fullTime.away ?? 0,
    status,
    minute: status === "live" && raw.minute ? `${raw.minute}'` : undefined,
    league: raw.competition.name,
    sport: "football",
    startTime: formatStartTime(kickoff),
  };
};

const fetchMatches = async (
  params: Record<string, string>,
): Promise<Match[]> => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/matches?${query}`;

  if (import.meta.env.DEV) console.log("[api.ts] fetch ->", url);

  const res = await fetch(url);

  if (import.meta.env.DEV) console.log("[api.ts] response status:", res.status);

  if (!res.ok) {
    throw new Error(`football-data.org error: ${res.status}`);
  }

  const data: MatchesResponse = await res.json();
  return data.matches.map(mapMatch).filter((m): m is Match => m !== null);
};

const toISO = (date: Date) => date.toISOString().slice(0, 10);

const fetchFootballMatches = async (): Promise<Match[]> => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 2);
  const to = new Date(now);
  to.setDate(to.getDate() + 7);

  return fetchMatches({ dateFrom: toISO(from), dateTo: toISO(to) });
};

const fetchBasketballMatches = async (): Promise<Match[]> => {
  return [];
};

export const fetchTodaysMatches = async (): Promise<Match[]> => {
  const [football, basketball] = await Promise.all([
    fetchFootballMatches(),
    fetchBasketballMatches(),
  ]);

  return [...football, ...basketball];
};

export const fetchLiveMatches = async (): Promise<Match[]> => {
  const all = await fetchTodaysMatches();
  return all.filter((m) => m.status === "live");
};

export const fetchLiveOnly = async (): Promise<Match[]> => {
  const today = toISO(new Date());
  return fetchMatches({ dateFrom: today, dateTo: today, status: "LIVE" });
};

export const fetchRecentResults = async (): Promise<Match[]> => {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 7);

  return fetchMatches({
    dateFrom: toISO(from),
    dateTo: toISO(now),
    status: "FINISHED",
  });
};

export const fetchUpcomingOnly = async (): Promise<Match[]> => {
  const now = new Date();
  const to = new Date(now);
  to.setDate(to.getDate() + 9);

  return fetchMatches({
    dateFrom: toISO(now),
    dateTo: toISO(to),
    status: "SCHEDULED",
  });
};

export interface StandingEntry {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface RawStandingRow {
  position: number;
  team: { name: string; shortName: string | null };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface RawStandingsGroup {
  type: "TOTAL" | "HOME" | "AWAY";
  table: RawStandingRow[];
}

interface StandingsResponse {
  standings: RawStandingsGroup[];
}

export const fetchStandings = async (
  competitionCode: string,
): Promise<StandingEntry[]> => {
  const url = `${API_BASE}/competitions/${competitionCode}/standings`;

  if (import.meta.env.DEV) console.log("[api.ts] fetch ->", url);

  const res = await fetch(url);

  if (import.meta.env.DEV)
    console.log("[api.ts] standings status:", res.status);

  if (!res.ok) {
    const body = await res.text();
    if (import.meta.env.DEV)
      console.log("[api.ts] standings error body:", body);
    throw new Error(
      `football-data.org standings error: ${res.status} — ${body}`,
    );
  }

  const data: StandingsResponse = await res.json();
  const total = data.standings.find((s) => s.type === "TOTAL");
  if (!total) return [];

  return total.table.map((row) => ({
    position: row.position,
    team: row.team.shortName ?? row.team.name,
    played: row.playedGames,
    won: row.won,
    drawn: row.draw,
    lost: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    points: row.points,
  }));
};

// ---- Top strelci (scorers) ----
export interface TopScorer {
  playerId: number;
  playerName: string;
  team: string;
  nationality: string | null;
  goals: number;
  assists: number | null;
  playedMatches: number;
}

interface RawScorer {
  player: { id: number; name: string; nationality: string | null };
  team: { name: string; shortName: string | null };
  playedMatches: number;
  goals: number;
  assists: number | null;
}

interface ScorersResponse {
  scorers: RawScorer[];
}

export const fetchTopScorers = async (
  competitionCode: string,
): Promise<TopScorer[]> => {
  const url = `${API_BASE}/competitions/${competitionCode}/scorers?limit=10`;

  if (import.meta.env.DEV) console.log("[api.ts] fetch ->", url);

  const res = await fetch(url);

  if (import.meta.env.DEV) console.log("[api.ts] scorers status:", res.status);

  if (!res.ok) {
    const body = await res.text();
    if (import.meta.env.DEV) console.log("[api.ts] scorers error body:", body);
    throw new Error(`football-data.org scorers error: ${res.status} — ${body}`);
  }

  const data: ScorersResponse = await res.json();

  return data.scorers.map((s) => ({
    playerId: s.player.id,
    playerName: s.player.name,
    team: s.team.shortName ?? s.team.name,
    nationality: s.player.nationality,
    goals: s.goals,
    assists: s.assists,
    playedMatches: s.playedMatches,
  }));
};
