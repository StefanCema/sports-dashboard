import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStandings, useCompetitionForm } from "../hooks/useStandings";
import { LEAGUES } from "../constants/leagues";
import { LeagueTabs } from "../components/ui/LeagueTabs";
import { TeamCrest } from "../components/matches/TeamCrest";
import { FormBadges } from "../components/matches/FormBadges";
import { SkeletonStandingsTable } from "../components/ui/PageSkeletons";

export const StandingsPage = () => {
  const navigate = useNavigate();
  const [activeLeague, setActiveLeague] = useState(LEAGUES[0].code);
  const {
    data: standings = [],
    isLoading,
    isError,
  } = useStandings(activeLeague);
  const { data: formMap } = useCompetitionForm(activeLeague);

  return (
    <div>
      <LeagueTabs active={activeLeague} onChange={setActiveLeague} />

      {isLoading && <SkeletonStandingsTable />}

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
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Team</div>
              <div className="col-span-3">Form</div>
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
                className={`grid grid-cols-12 gap-2 px-4 py-3 text-sm items-center transition-colors
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
                <div
                  onClick={() => navigate(`/team/${s.teamId}`)}
                  className="col-span-3 font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <TeamCrest src={s.crest} alt={s.team} size={20} />
                  {s.team}
                </div>
                <div className="col-span-3">
                  <FormBadges
                    results={formMap?.get(s.teamId) ?? []}
                    size={18}
                  />
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
