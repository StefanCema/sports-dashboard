import { useFavorites } from '../contexts/FavoritesContext';
import { useFavoriteMatches } from '../hooks/useMatchDetail';
import { MatchCard } from '../components/matches/MatchCard';

export const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { matches, isLoading, isError } = useFavoriteMatches(favorites);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-2xl">☆</p>
        <p className="text-gray-400 text-sm">No favorites yet.</p>
        <p className="text-gray-300 text-xs">Click the star on any match to save it.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading your favorites...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Failed to load your favorites. Try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
        Your Favorites ({matches.length})
      </p>
      {matches.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};
