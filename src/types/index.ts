export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "live" | "finished" | "upcoming";
  minute?: string;
  league: string;
  sport: "football" | "basketball" | "tennis" | "baseball";
  startTime: string;
  kickoffISO: string;
  homeCrest: string | null;
  awayCrest: string | null;
}

export type SportFilter =
  | "all"
  | "football"
  | "basketball"
  | "tennis"
  | "baseball";

// Vrednosti su sada URL path-ovi
export type NavTab = "/" | "/standings" | "/stats" | "/favorites";
