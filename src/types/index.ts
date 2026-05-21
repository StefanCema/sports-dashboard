export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'upcoming';
  minute?: string;      
  league: string;
  sport: 'football' | 'basketball' | 'tennis' | 'baseball';
  startTime: string;    
  stats?: MatchStats;
}

export interface MatchStats {
  possession?: string;   
  shots?: string;       
  corners?: string;     
  fouls?: string;        
  rebounds?: string;    
}

export type SportFilter = 'all' | 'football' | 'basketball' | 'tennis' | 'baseball';

export type NavTab = 'matches' | 'standings' | 'stats' | 'favorites';