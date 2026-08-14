export interface LeagueOption {
  code: string;
  label: string;
  flag: string;
}

export const LEAGUES: LeagueOption[] = [
  {
    code: "PL",
    label: "Premier League",
    flag: "https://crests.football-data.org/PL.png",
  },
  {
    code: "PD",
    label: "La Liga",
    flag: "https://crests.football-data.org/PD.png",
  },
  {
    code: "BL1",
    label: "Bundesliga",
    flag: "https://crests.football-data.org/BL1.png",
  },
  {
    code: "FL1",
    label: "Ligue 1",
    flag: "https://crests.football-data.org/FL1.png",
  },
  {
    code: "SA",
    label: "Serie A",
    flag: "https://crests.football-data.org/SA.png",
  },
  { code: "DED", label: "Eredivisie", flag: "" },
  {
    code: "ELC",
    label: "Championship",
    flag: "https://crests.football-data.org/ELC.png",
  },
];
