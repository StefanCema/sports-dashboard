import type { Match } from '../types';

export const fetchLiveMatches = async (): Promise<Match[]> => {
  return [
    {
      id: '1',
      homeTeam: 'Arsenal',
      awayTeam: 'Man City',
      homeScore: 2,
      awayScore: 1,
      status: 'live',
      minute: "64'",
      league: 'Premier League',
      sport: 'football',
      startTime: '20:00',
      stats: { possession: '54-46', shots: '8-5', corners: '4-3' },
    },
    {
      id: '2',
      homeTeam: 'Lakers',
      awayTeam: 'Celtics',
      homeScore: 87,
      awayScore: 91,
      status: 'live',
      minute: 'Q3 8:42',
      league: 'NBA',
      sport: 'basketball',
      startTime: '21:00',
      stats: { rebounds: '31-28', fouls: '14-12' },
    },
  ];
};

export const fetchTodaysMatches = async (): Promise<Match[]> => {
  return [
    {
      id: '3',
      homeTeam: 'Real Madrid',
      awayTeam: 'Atletico',
      homeScore: 3,
      awayScore: 0,
      status: 'finished',
      league: 'La Liga',
      sport: 'football',
      startTime: '18:00',
    },
    {
      id: '4',
      homeTeam: 'Chelsea',
      awayTeam: 'Liverpool',
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      league: 'Premier League',
      sport: 'football',
      startTime: '22:45',
    },
    {
      id: '5',
      homeTeam: 'Warriors',
      awayTeam: 'Nets',
      homeScore: 0,
      awayScore: 0,
      status: 'upcoming',
      league: 'NBA',
      sport: 'basketball',
      startTime: '23:00',
    },
  ];
};