import { useTodaysMatches } from '../../hooks/useMatches';

export const Sidebar = () => {
  const { data: matches } = useTodaysMatches();

  const liveCount = matches?.filter(m => m.status === 'live').length ?? 0;
  const upcomingMatches = matches?.filter(m => m.status === 'upcoming').slice(0, 4) ?? [];

  return (
    <aside className="w-72 shrink-0">
      {/* Quick Stats */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Today's Overview
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-semibold text-gray-800">{liveCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Live matches</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-semibold text-gray-800">{matches?.length ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total today</p>
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Upcoming
        </p>
        {upcomingMatches.length === 0 && (
          <p className="text-sm text-gray-400">No upcoming matches.</p>
        )}
        {upcomingMatches.map((match, i) => (
          <div
            key={match.id}
            className={`flex items-center justify-between py-2.5 ${
              i !== upcomingMatches.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div>
              <p className="text-sm text-gray-700">
                {match.homeTeam} vs {match.awayTeam}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{match.league}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {match.startTime}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};