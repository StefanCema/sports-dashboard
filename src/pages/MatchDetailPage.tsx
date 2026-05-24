import { useParams, useNavigate } from 'react-router-dom';
import { useAllMatches } from '../hooks/useMatches';
import { LiveBadge } from '../components/matches/LiveBadge';

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches, isLoading } = useAllMatches();

  if (isLoading) {
      return <div className="flex items-center justify-center h-64">Loading match...</div>;
    }

  const match = matches.find(m => m.id === id);

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-400 text-sm">Match not found.</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-emerald-600 hover:underline"
        >
          ← Back to matches
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Match header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-gray-400 font-medium">{match.league}</span>
          {match.status === 'live' && <LiveBadge minute={match.minute} />}
          {match.status === 'finished' && (
            <span className="text-xs text-gray-400 font-medium">FT</span>
          )}
          {match.status === 'upcoming' && (
            <span className="text-xs text-emerald-600 font-medium">{match.startTime}</span>
          )}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-xl font-semibold text-gray-800">{match.homeTeam}</p>
            <p className="text-xs text-gray-400 mt-1">Home</p>
          </div>

          <div className="text-center px-6">
            {match.status === 'upcoming' ? (
              <p className="text-3xl font-light text-gray-300">vs</p>
            ) : (
              <p className="text-4xl font-semibold text-gray-800 tracking-widest">
                {match.homeScore} – {match.awayScore}
              </p>
            )}
          </div>

          <div className="flex-1 text-center">
            <p className="text-xl font-semibold text-gray-800">{match.awayTeam}</p>
            <p className="text-xs text-gray-400 mt-1">Away</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {match.stats && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
            Match Stats
          </p>
          <div className="flex flex-col gap-4">
            {match.stats.possession && (
              <StatBar label="Possession" value={match.stats.possession} />
            )}
            {match.stats.shots && (
              <StatBar label="Shots" value={match.stats.shots} />
            )}
            {match.stats.corners && (
              <StatBar label="Corners" value={match.stats.corners} />
            )}
            {match.stats.rebounds && (
              <StatBar label="Rebounds" value={match.stats.rebounds} />
            )}
            {match.stats.fouls && (
              <StatBar label="Fouls" value={match.stats.fouls} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatBar = ({ label, value }: { label: string; value: string }) => {
  const [home, away] = value.split('-').map(Number);
  const total = home + away;
  const homePct = total > 0 ? (home / total) * 100 : 50;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-gray-700">{home}</span>
        <span className="text-xs text-gray-400">{label}</span>
        <span className="font-medium text-gray-700">{away}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${homePct}%` }}
        />
      </div>
    </div>
  );
};
