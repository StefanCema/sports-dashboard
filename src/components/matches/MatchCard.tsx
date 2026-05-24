import { useNavigate } from 'react-router-dom';
import { LiveBadge } from './LiveBadge';
import { useFavorites } from '../../contexts/FavoritesContext';
import type { Match } from '../../types';

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const favorited = isFavorite(match.id);

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      className={`
      bg-white dark:bg-gray-800 rounded-xl border p-4 mb-3 cursor-pointer transition-all duration-150
      hover:shadow-md dark:border-gray-700
      ${isLive ? 'border-l-4 border-l-emerald-500' : 'border-gray-100 dark:border-gray-700'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{match.league}</span>
        <div className="flex items-center gap-2">
          {isLive && <LiveBadge minute={match.minute} />}
          {isFinished && (
            <span className="text-xs text-gray-400 font-medium">FT</span>
          )}
          {match.status === 'upcoming' && (
            <span className="text-xs text-gray-400 font-medium">{match.startTime}</span>
          )}
          {/* Favorites dugme */}
          <button
            onClick={e => {
              e.stopPropagation(); // ne navigiraj na detalje
              toggleFavorite(match.id);
            }}
            className="text-lg leading-none transition-transform hover:scale-110"
          >
            {favorited ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{match.homeTeam}</p>
          <p className="text-xs text-gray-400 mt-0.5">Home</p>
        </div>

        <div className="text-center px-4">
          {match.status === 'upcoming' ? (
            <p className="text-lg font-medium text-gray-300">vs</p>
          ) : (
            <p className={`text-2xl font-semibold tracking-widest ${isFinished ? 'text-gray-400' : 'text-gray-800 dark:text-white'}`}>
              {match.homeScore} – {match.awayScore}
            </p>
          )}
        </div>

        <div className="flex-1 text-right">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{match.awayTeam}</p>
          <p className="text-xs text-gray-400 mt-0.5">Away</p>
        </div>
      </div>

      {/* Stats */}
      {isLive && match.stats && (
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
          {match.stats.possession && (
            <span className="text-xs text-gray-400">Poss: {match.stats.possession}</span>
          )}
          {match.stats.shots && (
            <span className="text-xs text-gray-400">Shots: {match.stats.shots}</span>
          )}
          {match.stats.corners && (
            <span className="text-xs text-gray-400">Corners: {match.stats.corners}</span>
          )}
          {match.stats.rebounds && (
            <span className="text-xs text-gray-400">Reb: {match.stats.rebounds}</span>
          )}
        </div>
      )}
    </div>
  );
};