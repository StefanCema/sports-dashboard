import { useParams, useNavigate } from "react-router-dom";
import { useMatchFull, useHeadToHead } from "../hooks/useMatchDetail";
import { LiveBadge } from "../components/matches/LiveBadge";
import { TeamCrest } from "../components/matches/TeamCrest";

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMatchFull(id);
  const match = data?.match;
  const detail = data?.detail;
  const {
    data: h2h,
    isLoading: h2hLoading,
    isError: h2hError,
  } = useHeadToHead(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        Loading match...
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-400 text-sm">Match not found.</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          ← Back to matches
        </button>
      </div>
    );
  }

  const hasExtraInfo =
    detail && (detail.halfTimeScore || detail.venue || detail.referee);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Match header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-gray-400 font-medium">
            {match.league}
          </span>
          {match.status === "live" && <LiveBadge minute={match.minute} />}
          {match.status === "finished" && (
            <span className="text-xs text-gray-400 font-medium">FT</span>
          )}
          {match.status === "upcoming" && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {match.startTime}
            </span>
          )}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between">
          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <TeamCrest src={match.homeCrest} alt={match.homeTeam} size={44} />
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {match.homeTeam}
            </p>
            <p className="text-xs text-gray-400 -mt-1">Home</p>
          </div>

          <div className="text-center px-6">
            {match.status === "upcoming" ? (
              <p className="text-3xl font-light text-gray-300 dark:text-gray-600">
                vs
              </p>
            ) : (
              <p className="text-4xl font-semibold text-gray-800 dark:text-gray-100 tracking-widest">
                {match.homeScore} – {match.awayScore}
              </p>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <TeamCrest src={match.awayCrest} alt={match.awayTeam} size={44} />
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {match.awayTeam}
            </p>
            <p className="text-xs text-gray-400 -mt-1">Away</p>
          </div>
        </div>

        {/* Poluvreme / stadion / sudija — iz /matches/{id}, samo kad postoje podaci */}
        {hasExtraInfo && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-5 pt-4 border-t border-gray-50 dark:border-gray-700">
            {detail?.halfTimeScore && (
              <span>
                HT {detail.halfTimeScore.home}–{detail.halfTimeScore.away}
              </span>
            )}
            {detail?.venue && <span>{detail.venue}</span>}
            {detail?.referee && <span>Referee: {detail.referee}</span>}
          </div>
        )}
      </div>

      {/* Head to Head */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Head to Head
        </p>

        {h2hLoading && (
          <p className="text-sm text-gray-400">Loading history...</p>
        )}

        {h2hError && (
          <p className="text-sm text-gray-400">
            Head-to-head history is unavailable right now.
          </p>
        )}

        {h2h && h2h.numberOfMatches === 0 && (
          <p className="text-sm text-gray-400">
            No previous meetings on record.
          </p>
        )}

        {h2h && h2h.numberOfMatches > 0 && (
          <>
            {/* Agregat */}
            <div className="flex items-center justify-around text-center mb-5">
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {h2h.homeWins}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {match.homeTeam} wins
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {h2h.draws}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Draws</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {h2h.awayWins}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {match.awayTeam} wins
                </p>
              </div>
            </div>

            {/* Poslednji susreti */}
            <div className="flex flex-col">
              {h2h.recentMeetings.map((m, i) => (
                <div
                  key={m.id}
                  className={`flex items-center justify-between text-sm py-2 ${
                    i !== 0
                      ? "border-t border-gray-50 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <span className="text-xs text-gray-400">
                    {new Date(m.date).toLocaleDateString("sr-RS", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    {m.homeTeam} {m.homeScore ?? "–"} : {m.awayScore ?? "–"}{" "}
                    {m.awayTeam}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
