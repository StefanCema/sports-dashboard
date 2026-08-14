import { useQuery } from "@tanstack/react-query";
import {
  fetchLiveMatches,
  fetchTodaysMatches,
  fetchLiveOnly,
  fetchRecentResults,
  fetchUpcomingOnly,
} from "../services/api";
import type { SportFilter } from "../types";
import { useMemo } from "react";

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
    staleTime: 20000,
  });
};

export const useTodaysMatches = () => {
  return useQuery({
    queryKey: ["todaysMatches"],
    queryFn: fetchTodaysMatches,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};

export const useAllMatches = () => {
  const live = useLiveMatches();
  const todays = useTodaysMatches();

  const matches = useMemo(() => {
    const all = [...(live.data ?? []), ...(todays.data ?? [])];
    const unique = Array.from(new Map(all.map((m) => [m.id, m])).values());
    return unique.sort((a, b) => {
      const order = { live: 0, upcoming: 1, finished: 2 };
      return order[a.status] - order[b.status];
    });
  }, [live.data, todays.data]);

  return {
    matches,
    isLoading: live.isLoading || todays.isLoading,
    isError: live.isError || todays.isError,
  };
};

export const useFilteredMatches = (filter: SportFilter) => {
  const { matches, isLoading, isError } = useAllMatches();

  const filtered =
    filter === "all" ? matches : matches.filter((m) => m.sport === filter);

  return { matches: filtered, isLoading, isError };
};

export const useLiveOnlyMatches = () => {
  return useQuery({
    queryKey: ["matches", "live-tab"],
    queryFn: fetchLiveOnly,
    refetchInterval: 30000,
    staleTime: 15000,
  });
};

export const useResultsMatches = () => {
  return useQuery({
    queryKey: ["matches", "results-tab"],
    queryFn: fetchRecentResults,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingOnlyMatches = () => {
  return useQuery({
    queryKey: ["matches", "upcoming-tab"],
    queryFn: fetchUpcomingOnly,
    staleTime: 5 * 60 * 1000,
  });
};
