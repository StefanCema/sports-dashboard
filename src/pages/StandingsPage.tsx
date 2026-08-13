import { useState } from "react";
import { useStandings } from "../hooks/useStandings";
import { LEAGUES } from "../constants/leagues";

export const StandingsPage = () => {
  const [activeLeague, setActiveLeague] = useState(LEAGUES[0].code);
  const {
    data: standings = [],
    isLoading,
    isError,
  } = useStandings(activeLeague);

  return (
    <div>
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
          <p className="text-gray-400 text-sm">Loading standings...</p>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">
            Failed to load standings. Try again later.
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-9 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Team</div>
              <div className="text-center">P</div>
              <div className="text-center">W</div>
              <div className="text-center">D</div>
              <div className="text-center">L</div>
              <div className="text-center font-bold text-gray-500">PTS</div>
            </div>

            {/* Table rows */}
            {standings.map((s, i) => (
              <div
                key={s.team}
                className={`grid grid-cols-9 gap-2 px-4 py-3 text-sm transition-colors
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  ${i !== standings.length - 1 ? "border-b border-gray-50 dark:border-gray-700" : ""}
                `}
              >
                <div className="col-span-1">
                  <span
                    className={`
                    font-medium
                    ${s.position <= 4 ? "text-emerald-500" : ""}
                    ${s.position > 4 && s.position <= 6 ? "text-blue-400" : ""}
                    ${s.position > 6 ? "text-gray-400 dark:text-gray-500" : ""}
                  `}
                  >
                    {s.position}
                  </span>
                </div>
                <div className="col-span-3 font-medium text-gray-800 dark:text-gray-100">
                  {s.team}
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {s.played}
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {s.won}
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {s.drawn}
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {s.lost}
                </div>
                <div className="text-center font-bold text-gray-800 dark:text-gray-100">
                  {s.points}
                </div>
              </div>
            ))}

            {standings.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 text-sm">No standings available.</p>
              </div>
            )}
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
        </>
      )}
    </div>
  );
};
