import { useState, useMemo } from "react";
import { MatchCard } from "./MatchCard";
import { FilterChip } from "../ui/FilterChip";
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

  const sportFiltered = useMemo(
    () =>
      activeFilter === "all"
        ? matches
        : matches.filter((m) => m.sport === activeFilter),
    [matches, activeFilter],
  );

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
    return Array.from(groups.entries());
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

      {/* Sport filter */}
      <div className="flex gap-2 flex-wrap mb-3">
        {FILTERS.map((f) => (
          <FilterChip
            key={f.value}
            label={f.label}
            active={activeFilter === f.value}
            onClick={() => setActiveFilter(f.value)}
          />
        ))}
      </div>

      {/* League filter */}
      {availableLeagues.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">
            Filter:
          </span>
          {availableLeagues.map((league) => (
            <button
              key={league}
              onClick={() => toggleLeague(league)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150
                ${
                  effectiveSelectedLeagues.includes(league)
                    ? "bg-blue-100 border-blue-400 text-blue-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                }`}
            >
              {league}
            </button>
          ))}
          {effectiveSelectedLeagues.length > 0 && (
            <button
              onClick={() => setSelectedLeagues([])}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline ml-1"
            >
              Clear
            </button>
          )}
        </div>
      )}

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
