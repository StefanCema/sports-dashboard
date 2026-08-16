import type { Match } from "../types";

// Custom greska koja nosi HTTP status kod — koristi se da React Query zna
// KADA ima smisla automatski ponoviti poziv, a kada ne (npr. 429 "prekoracen
// limit" ili 404 "ne postoji" NIKAD ne treba automatski ponavljati — ponovni
// pokusaj samo produzava/pogorsava problem, ne resava ga).
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// football-data.org — besplatan, pouzdan fudbalski API sa PRAVIM live statusom
// (SCHEDULED / IN_PLAY / PAUSED / FINISHED), ne procenom kao kod prethodnog
// pokusaja. Free tier pokriva ~12 najvecih takmicenja (Premier League, La Liga,
// Serie A, Bundesliga, Ligue 1, Champions League...) i limit je 10 poziva/minut.
//
// SAMO FUDBAL na free tier-u — nema besplatne kosarke koja je istovremeno
// pouzdana i CORS-friendly, pa smo tu funkciju za sad ostavili praznu
// (vidi fetchBasketballMatches ispod) umesto da rizikujemo nestabilan izvor.
//
// VAZNO — CORS: football-data.org free tier vraca fiksan
// "Access-Control-Allow-Origin: http://localhost" header (bez porta), pa
// browser blokira direktan poziv sa Vite dev servera (localhost:5173).
// Zato ovde NE zovemo api.football-data.org direktno, vec relativnu putanju
// '/api/football/...' koju Vite-ov dev proxy (vidi vite.config.ts) prosledjuje
// server-side, gde CORS ne vazi. Token se dodaje u proxy-ju, ne ovde.
//
// SETUP (obavezno pre pokretanja):
// 1. Registruj se besplatno: https://www.football-data.org/client/register
// 2. Kopiraj svoj X-Auth-Token sa naloga
// 3. U root-u projekta (pored package.json) napravi .env fajl sa:
//      VITE_FOOTBALL_DATA_TOKEN=tvoj_token_ovde
// 4. Dodaj proxy podesavanje u vite.config.ts (vidi primer u README/uputstvu)
// 5. Restartuj `npm run dev` (Vite env i config promene traze restart)
//
// NAPOMENA O PRODUKCIJI: ovaj proxy radi samo lokalno (npm run dev). Kad app
// deploy-ujes (Vercel/Netlify), treba ti ekvivalentna serverless funkcija koja
// radi istu stvar — javi kad stignes do tog koraka, sredicemo i to.

const API_BASE = "/api/football";

if (import.meta.env.DEV) {
  const token = import.meta.env.VITE_FOOTBALL_DATA_TOKEN as string | undefined;
  console.log(
    "[api.ts] VITE_FOOTBALL_DATA_TOKEN:",
    token ? `ucitan (${token.slice(0, 4)}...)` : "NIJE UCITAN",
  );
}

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
    kickoffISO: kickoff.toISOString(),
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
    throw new ApiError(res.status, `football-data.org error: ${res.status}`);
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

// ---- Standings (tabela lige) ----

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
    throw new ApiError(
      res.status,
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
    throw new ApiError(
      res.status,
      `football-data.org scorers error: ${res.status} — ${body}`,
    );
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
  const url = `${API_BASE}/matches/${matchId}`;

  if (import.meta.env.DEV) console.log("[api.ts] fetch ->", url);

  const res = await fetch(url);

  if (import.meta.env.DEV) console.log("[api.ts] match status:", res.status);

  if (!res.ok) {
    const body = await res.text();
    if (import.meta.env.DEV) console.log("[api.ts] match error body:", body);
    throw new ApiError(
      res.status,
      `football-data.org match error: ${res.status} — ${body}`,
    );
  }

  const raw: RawMatchFull = await res.json();
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

// ---- Head-to-head

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
  const url = `${API_BASE}/matches/${matchId}/head2head?limit=5`;

  if (import.meta.env.DEV) console.log("[api.ts] fetch ->", url);

  const res = await fetch(url);

  if (import.meta.env.DEV)
    console.log("[api.ts] head2head status:", res.status);

  if (!res.ok) {
    const body = await res.text();
    if (import.meta.env.DEV)
      console.log("[api.ts] head2head error body:", body);
    throw new ApiError(
      res.status,
      `football-data.org head2head error: ${res.status} — ${body}`,
    );
  }

  const data: RawH2HResponse = await res.json();

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
