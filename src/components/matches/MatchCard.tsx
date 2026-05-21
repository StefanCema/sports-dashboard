import { LiveBadge } from './LiveBadge';
import type { Match } from '../../types';

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <div
      className={`
        bg-white rounded-xl border p-4 mb-3 cursor-pointer transition-all duration-150
        hover:shadow-md
        ${isLive ? 'border-l-4 border-l-emerald-500 border-gray-100' : 'border-gray-100'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 font-medium">{match.league}</span>
        {isLive && <LiveBadge minute={match.minute} />}
        {isFinished && (
          <span className="text-xs text-gray-400 font-medium">FT</span>
        )}
        {match.status === 'upcoming' && (
          <span className="text-xs text-gray-400 font-medium">{match.startTime}</span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center">
        {/* Home team */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{match.homeTeam}</p>
          <p className="text-xs text-gray-400 mt-0.5">Home</p>
        </div>

        {/* Score */}
        <div className="text-center px-4">
          {match.status === 'upcoming' ? (
            <p className="text-lg font-medium text-gray-300">vs</p>
          ) : (
            <p className={`text-2xl font-semibold tracking-widest ${isFinished ? 'text-gray-400' : 'text-gray-800'}`}>
              {match.homeScore} – {match.awayScore}
            </p>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 text-right">
          <p className="text-sm font-semibold text-gray-800">{match.awayTeam}</p>
          <p className="text-xs text-gray-400 mt-0.5">Away</p>
        </div>
      </div>

      {/* Stats (samo za live mečeve) */}
      {isLive && match.stats && (
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
          {match.stats.possession && (
            <span className="text-xs text-gray-400">
              Poss: {match.stats.possession}
            </span>
          )}
          {match.stats.shots && (
            <span className="text-xs text-gray-400">
              Shots: {match.stats.shots}
            </span>
          )}
          {match.stats.corners && (
            <span className="text-xs text-gray-400">
              Corners: {match.stats.corners}
            </span>
          )}
          {match.stats.rebounds && (
            <span className="text-xs text-gray-400">
              Reb: {match.stats.rebounds}
            </span>
          )}
        </div>
      )}
    </div>
  );
};