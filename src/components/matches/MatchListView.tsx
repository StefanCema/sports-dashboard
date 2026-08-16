import { useState, useMemo } from "react";
import { MatchCard } from "./MatchCard";
import { Dropdown } from "../ui/Dropdown";
import { SkeletonList } from "../ui/SkeletonCard";
import { useSearch } from "../../contexts/SearchContext";
import type { Match, SportFilter } from "../../types";

const FILTERS: { label: string; value: SportFilter }[] = [
  { label: "All Sports", value: "all" },
  { label: "Football", value: "football" },
  { label: "Basketball", value: "basketball" },
  { label: "Tennis", value: "tennis" },
  { label: "Baseball", value: "baseball" },
];

interface MatchListViewProps {
  matches: Match[];
  isLoading: boolean;
  isError: boolean;
  heading: string;
  emptyText: string;
  errorText?: string;
}

export const MatchListView = ({
  matches,
  isLoading,
  isError,
  heading,
  emptyText,
  errorText,
}: MatchListViewProps) => {
  const [activeFilter, setActiveFilter] = useState<SportFilter>("all");
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [collapsedLeagues, setCollapsedLeagues] = useState<Set<string>>(
    new Set(),
  );
  const { query } = useSearch();

  const availableSports = useMemo(() => {
    const seen: SportFilter[] = [];
    for (const m of matches) {
      if (!seen.includes(m.sport)) seen.push(m.sport);
    }
    return seen;
  }, [matches]);

  const sportOptions = FILTERS.filter(
    (f) => f.value === "all" || availableSports.includes(f.value),
  );

  const effectiveActiveFilter: SportFilter =
    activeFilter === "all" || availableSports.includes(activeFilter)
      ? activeFilter
      : "all";

  const sportFiltered = useMemo(
    () =>
      effectiveActiveFilter === "all"
        ? matches
        : matches.filter((m) => m.sport === effectiveActiveFilter),
    [matches, effectiveActiveFilter],
  );

  const activeSportLabel =
    FILTERS.find((f) => f.value === effectiveActiveFilter)?.label ?? "Sport";

  const availableLeagues = useMemo(() => {
    const seen: string[] = [];
    for (const m of sportFiltered) {
      if (!seen.includes(m.league)) seen.push(m.league);
    }
    return seen.sort((a, b) => a.localeCompare(b));
  }, [sportFiltered]);

  const effectiveSelectedLeagues = useMemo(
    () => selectedLeagues.filter((l) => availableLeagues.includes(l)),
    [selectedLeagues, availableLeagues],
  );

  const toggleLeague = (league: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(league)
        ? prev.filter((l) => l !== league)
        : [...prev, league],
    );
  };

  const leagueFiltered = useMemo(() => {
    if (effectiveSelectedLeagues.length === 0) return sportFiltered;
    return sportFiltered.filter((m) =>
      effectiveSelectedLeagues.includes(m.league),
    );
  }, [sportFiltered, effectiveSelectedLeagues]);

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leagueFiltered;
    return leagueFiltered.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q),
    );
  }, [leagueFiltered, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Match[]>();
    for (const m of searched) {
      if (!groups.has(m.league)) groups.set(m.league, []);
      groups.get(m.league)!.push(m);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [searched]);

  const toggleCollapse = (league: string) => {
    setCollapsedLeagues((prev) => {
      const next = new Set(prev);
      if (next.has(league)) next.delete(league);
      else next.add(league);
      return next;
    });
  };

  if (isLoading) {
    return <SkeletonList />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">
          {errorText ?? "Failed to load matches. Try again later."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {heading}
      </h2>

      {/* Sport + League filteri*/}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {/* Sport filter — samo ako ima vise od jednog sporta sa podacima */}
        {availableSports.length > 1 && (
          <Dropdown label={`Sport: ${activeSportLabel}`}>
            {(close) => (
              <>
                {sportOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      setActiveFilter(f.value);
                      close();
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      ${
                        effectiveActiveFilter === f.value
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </>
            )}
          </Dropdown>
        )}

        {/* League filter */}
        {availableLeagues.length > 1 && (
          <Dropdown
            label={`Leagues${effectiveSelectedLeagues.length > 0 ? ` (${effectiveSelectedLeagues.length})` : ""}`}
          >
            {() => (
              <>
                {availableLeagues.map((league) => (
                  <label
                    key={league}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={effectiveSelectedLeagues.includes(league)}
                      onChange={() => toggleLeague(league)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    {league}
                  </label>
                ))}
                {effectiveSelectedLeagues.length > 0 && (
                  <button
                    onClick={() => setSelectedLeagues([])}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-t border-gray-100 dark:border-gray-700 mt-1"
                  >
                    Clear selection
                  </button>
                )}
              </>
            )}
          </Dropdown>
        )}
      </div>

      {/* Grupe po ligi */}
      {grouped.map(([league, leagueMatches]) => {
        const isCollapsed = collapsedLeagues.has(league);
        return (
          <div key={league} className="mb-5">
            <button
              onClick={() => toggleCollapse(league)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {league}{" "}
                <span className="normal-case text-gray-300 dark:text-gray-600">
                  ({leagueMatches.length})
                </span>
              </p>
              <span
                className={`text-gray-400 text-xs transition-transform duration-150 ${
                  isCollapsed ? "-rotate-90" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {!isCollapsed &&
              leagueMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
          </div>
        );
      })}

      {grouped.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">
            {query.trim()
              ? `No matches found for "${query.trim()}".`
              : emptyText}
          </p>
        </div>
      )}
    </div>
  );
};
