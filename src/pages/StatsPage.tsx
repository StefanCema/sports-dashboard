import { useState } from "react";
import { useTopScorers } from "../hooks/useTopScorers";
import { LEAGUES } from "../constants/leagues";

export const StatsPage = () => {
  const [activeLeague, setActiveLeague] = useState(LEAGUES[0].code);
  const {
    data: scorers = [],
    isLoading,
    isError,
  } = useTopScorers(activeLeague);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
        Top Scorers
      </h2>
      <p className="text-sm text-gray-400 mb-4">Najbolji strelci ove sezone</p>

      {/* League tabs */}
      <div className="flex gap-2 mb-5">
        {LEAGUES.map((league) => (
          <button
            key={league.code}
            onClick={() => setActiveLeague(league.code)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
              ${
                activeLeague === league.code
                  ? "bg-emerald-100 border-emerald-400 text-emerald-800"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
              }`}
          >
            {league.flag ? (
              <img
                src={league.flag}
                style={{ height: "50px", display: "inline-block" }}
              />
            ) : (
              league.label
            )}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading top scorers...</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">
            Failed to load top scorers (sezona mozda jos nije pocela za ovu
            ligu).
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-400 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-3">Team</div>
            <div className="col-span-1 text-center">MP</div>
            <div className="col-span-1 text-center">A</div>
            <div className="col-span-1 text-center font-bold text-gray-500">
              G
            </div>
          </div>

          {scorers.map((s, i) => (
            <div
              key={s.playerId}
              className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center transition-colors
                hover:bg-gray-50 dark:hover:bg-gray-700
                ${i !== scorers.length - 1 ? "border-b border-gray-50 dark:border-gray-700" : ""}
              `}
            >
              <div className="col-span-1 font-medium text-gray-400">
                {i + 1}
              </div>
              <div className="col-span-5">
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  {s.playerName}
                </div>
                {s.nationality && (
                  <div className="text-xs text-gray-400">{s.nationality}</div>
                )}
              </div>
              <div className="col-span-3 text-gray-500 dark:text-gray-400">
                {s.team}
              </div>
              <div className="col-span-1 text-center text-gray-500 dark:text-gray-400">
                {s.playedMatches}
              </div>
              <div className="col-span-1 text-center text-gray-500 dark:text-gray-400">
                {s.assists ?? "—"}
              </div>
              <div className="col-span-1 text-center font-bold text-emerald-600 dark:text-emerald-400">
                {s.goals}
              </div>
            </div>
          ))}

          {scorers.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-400 text-sm">No scorer data available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
