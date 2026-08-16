import type { Match } from "../types";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE = "/api/football";

if (import.meta.env.DEV) {
  const token = import.meta.env.VITE_FOOTBALL_DATA_TOKEN as string | undefined;
  console.log(
    "[api.ts] VITE_FOOTBALL_DATA_TOKEN:",
    token ? `ucitan (${token.slice(0, 4)}...)` : "NIJE UCITAN",
  );
}

const apiFetch = async <T>(path: string): Promise<T> => {
  const url = `${API_BASE}${path}`;

  if (import.meta.env.DEV) console.log("[api.ts] fetch ->", url);

  const res = await fetch(url);

  if (import.meta.env.DEV)
    console.log("[api.ts] response status:", res.status, url);

  if (!res.ok) {
    const body = await res.text();
    if (import.meta.env.DEV) console.log("[api.ts] error body:", body);
    throw new ApiError(
      res.status,
      `football-data.org error: ${res.status} — ${body}`,
    );
  }

  return res.json() as Promise<T>;
};

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

interface RawTeam {
  name: string;
  shortName: string | null;
  crest: string | null;
}

interface RawMatch {
  id: number;
  utcDate: string;
  status: RawStatus;
  minute?: number | null;
  competition: { name: string };
  homeTeam: RawTeam;
  awayTeam: RawTeam;
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
    kickoffISO: kickoff.toISOString(),
    homeCrest: raw.homeTeam.crest,
    awayCrest: raw.awayTeam.crest,
  };
};

const fetchMatches = async (
  params: Record<string, string>,
): Promise<Match[]> => {
  const query = new URLSearchParams(params).toString();
  const data = await apiFetch<MatchesResponse>(`/matches?${query}`);
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

// Live tab
export const fetchLiveOnly = async (): Promise<Match[]> => {
  const today = toISO(new Date());
  return fetchMatches({ dateFrom: today, dateTo: today, status: "LIVE" });
};

// Results tab
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

// Upcoming tab
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

// ---- Standings

export interface StandingEntry {
  position: number;
  team: string;
  crest: string | null;
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
  team: RawTeam;
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
  const data = await apiFetch<StandingsResponse>(
    `/competitions/${competitionCode}/standings`,
  );
  const total = data.standings.find((s) => s.type === "TOTAL");
  if (!total) return [];

  return total.table.map((row) => ({
    position: row.position,
    team: row.team.shortName ?? row.team.name,
    crest: row.team.crest,
    played: row.playedGames,
    won: row.won,
    drawn: row.draw,
    lost: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    points: row.points,
  }));
};

// ---- Top strelci
export interface TopScorer {
  playerId: number;
  playerName: string;
  team: string;
  teamCrest: string | null;
  nationality: string | null;
  goals: number;
  assists: number | null;
  playedMatches: number;
}

interface RawScorer {
  player: { id: number; name: string; nationality: string | null };
  team: RawTeam;
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
  const data = await apiFetch<ScorersResponse>(
    `/competitions/${competitionCode}/scorers?limit=10`,
  );

  return data.scorers.map((s) => ({
    playerId: s.player.id,
    playerName: s.player.name,
    team: s.team.shortName ?? s.team.name,
    teamCrest: s.team.crest,
    nationality: s.player.nationality,
    goals: s.goals,
    assists: s.assists,
    playedMatches: s.playedMatches,
  }));
};

// ---- Pojedinacan mec po ID-ju

export interface MatchDetail {
  venue: string | null;
  referee: string | null;
  matchday: number | null;
  halfTimeScore: { home: number; away: number } | null;
}

export interface MatchFull {
  match: Match;
  detail: MatchDetail;
}

interface RawMatchFull extends Omit<RawMatch, "score"> {
  venue: string | null;
  matchday: number | null;
  referees: { name: string }[];
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
}

export const fetchMatchFull = async (matchId: string): Promise<MatchFull> => {
  const raw = await apiFetch<RawMatchFull>(`/matches/${matchId}`);
  const mapped = mapMatch(raw);

  if (!mapped) {
    throw new Error(
      "Ovaj mec trenutno nema podrzan status (npr. odlozen/otkazan).",
    );
  }

  const ht = raw.score.halfTime;

  return {
    match: mapped,
    detail: {
      venue: raw.venue,
      referee: raw.referees[0]?.name ?? null,
      matchday: raw.matchday,
      halfTimeScore:
        ht.home !== null && ht.away !== null
          ? { home: ht.home, away: ht.away }
          : null,
    },
  };
};

//  Head-to-head

export interface HeadToHeadMeeting {
  id: string;
  date: string; // ISO
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  competition: string;
}

export interface HeadToHead {
  numberOfMatches: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  totalGoals: number;
  recentMeetings: HeadToHeadMeeting[];
}

interface RawH2HMatch {
  id: number;
  utcDate: string;
  homeTeam: { name: string; shortName: string | null };
  awayTeam: { name: string; shortName: string | null };
  score: { fullTime: { home: number | null; away: number | null } };
  competition: { name: string };
}

interface RawH2HResponse {
  head2head: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: { wins: number; draws: number; losses: number };
    awayTeam: { wins: number; draws: number; losses: number };
  };
  matches: RawH2HMatch[];
}

export const fetchHeadToHead = async (matchId: string): Promise<HeadToHead> => {
  const data = await apiFetch<RawH2HResponse>(
    `/matches/${matchId}/head2head?limit=5`,
  );

  return {
    numberOfMatches: data.head2head.numberOfMatches,
    homeWins: data.head2head.homeTeam.wins,
    draws: data.head2head.homeTeam.draws,
    awayWins: data.head2head.awayTeam.wins,
    totalGoals: data.head2head.totalGoals,
    recentMeetings: (data.matches ?? []).map((m) => ({
      id: String(m.id),
      date: m.utcDate,
      homeTeam: m.homeTeam.shortName ?? m.homeTeam.name,
      awayTeam: m.awayTeam.shortName ?? m.awayTeam.name,
      homeScore: m.score.fullTime.home,
      awayScore: m.score.fullTime.away,
      competition: m.competition.name,
    })),
  };
};
