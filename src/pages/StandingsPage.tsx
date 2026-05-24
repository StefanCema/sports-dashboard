import { useState } from 'react';

interface Standing {
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

const PREMIER_LEAGUE_STANDINGS: Standing[] = [
  { position: 1, team: 'Manchester City', played: 38, won: 28, drawn: 5, lost: 5, goalsFor: 96, goalsAgainst: 45, points: 89 },
  { position: 2, team: 'Arsenal', played: 38, won: 26, drawn: 6, lost: 6, goalsFor: 91, goalsAgainst: 29, points: 84 },
  { position: 3, team: 'Liverpool', played: 38, won: 24, drawn: 6, lost: 8, goalsFor: 86, goalsAgainst: 41, points: 78 },
  { position: 4, team: 'Aston Villa', played: 38, won: 20, drawn: 8, lost: 10, goalsFor: 76, goalsAgainst: 61, points: 68 },
  { position: 5, team: 'Tottenham', played: 38, won: 20, drawn: 6, lost: 12, goalsFor: 74, goalsAgainst: 61, points: 66 },
  { position: 6, team: 'Chelsea', played: 38, won: 18, drawn: 9, lost: 11, goalsFor: 77, goalsAgainst: 63, points: 63 },
  { position: 7, team: 'Newcastle', played: 38, won: 18, drawn: 3, lost: 17, goalsFor: 85, goalsAgainst: 62, points: 57 },
  { position: 8, team: 'Man United', played: 38, won: 14, drawn: 4, lost: 20, goalsFor: 57, goalsAgainst: 79, points: 46 },
  { position: 9, team: 'West Ham', played: 38, won: 14, drawn: 3, lost: 21, goalsFor: 60, goalsAgainst: 74, points: 45 },
  { position: 10, team: 'Brighton', played: 38, won: 12, drawn: 8, lost: 18, goalsFor: 55, goalsAgainst: 62, points: 44 },
];

const NBA_STANDINGS: Standing[] = [
  { position: 1, team: 'Boston Celtics', played: 82, won: 64, drawn: 0, lost: 18, goalsFor: 120, goalsAgainst: 107, points: 64 },
  { position: 2, team: 'Oklahoma City', played: 82, won: 57, drawn: 0, lost: 25, goalsFor: 118, goalsAgainst: 110, points: 57 },
  { position: 3, team: 'Cleveland', played: 82, won: 55, drawn: 0, lost: 27, goalsFor: 113, goalsAgainst: 106, points: 55 },
  { position: 4, team: 'Orlando Magic', played: 82, won: 47, drawn: 0, lost: 35, goalsFor: 109, goalsAgainst: 108, points: 47 },
  { position: 5, team: 'Indiana Pacers', played: 82, won: 47, drawn: 0, lost: 35, goalsFor: 123, goalsAgainst: 119, points: 47 },
  { position: 6, team: 'Milwaukee Bucks', played: 82, won: 49, drawn: 0, lost: 33, goalsFor: 115, goalsAgainst: 113, points: 49 },
  { position: 7, team: 'New York Knicks', played: 82, won: 47, drawn: 0, lost: 35, goalsFor: 114, goalsAgainst: 111, points: 47 },
  { position: 8, team: 'Philadelphia', played: 82, won: 47, drawn: 0, lost: 35, goalsFor: 114, goalsAgainst: 113, points: 47 },
];

type LeagueTab = 'premier_league' | 'nba';

export const StandingsPage = () => {
  const [activeLeague, setActiveLeague] = useState<LeagueTab>('premier_league');

  const standings = activeLeague === 'premier_league'
    ? PREMIER_LEAGUE_STANDINGS
    : NBA_STANDINGS;

  const isNBA = activeLeague === 'nba';

  return (
    <div>
      {/* League tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveLeague('premier_league')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
            ${activeLeague === 'premier_league'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
            }`}
        >
          🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
        </button>
        <button
          onClick={() => setActiveLeague('nba')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
            ${activeLeague === 'nba'
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
            }`}
        >
          🏀 NBA
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-9 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Team</div>
          <div className="text-center">P</div>
          <div className="text-center">W</div>
          <div className="text-center">{isNBA ? 'L' : 'D'}</div>
          <div className="text-center">{isNBA ? 'W%' : 'L'}</div>
          <div className="text-center font-bold text-gray-500">PTS</div>
        </div>

        {/* Table rows */}
        {standings.map((s, i) => (
          <div
            key={s.team}
            className={`grid grid-cols-9 gap-2 px-4 py-3 text-sm transition-colors
              hover:bg-gray-50 dark:hover:bg-gray-700
              ${i !== standings.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''}
            `}
          >
            <div className="col-span-1">
              <span className={`
                font-medium
                ${s.position <= 4 ? 'text-emerald-500' : ''}
                ${s.position > 4 && s.position <= 6 ? 'text-blue-400' : ''}
                ${s.position > 6 ? 'text-gray-400 dark:text-gray-500' : ''}
              `}>
                {s.position}
              </span>
            </div>
            <div className="col-span-3 font-medium text-gray-800 dark:text-gray-100">
              {s.team}
            </div>
            <div className="text-center text-gray-500 dark:text-gray-400">{s.played}</div>
            <div className="text-center text-gray-500 dark:text-gray-400">{s.won}</div>
            <div className="text-center text-gray-500 dark:text-gray-400">{isNBA ? '-' : s.drawn}</div>
            <div className="text-center text-gray-500 dark:text-gray-400">
              {isNBA ? `${Math.round((s.won / s.played) * 100)}%` : s.lost}
            </div>
            <div className="text-center font-bold text-gray-800 dark:text-gray-100">{s.points}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-400">Champions League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs text-gray-400">Europa League</span>
        </div>
      </div>
    </div>
  );
};