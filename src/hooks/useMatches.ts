import { useQuery } from "@tanstack/react-query";
import {
  fetchLiveMatches,
  fetchTodaysMatches,
  fetchLiveOnly,
  fetchRecentResults,
  fetchUpcomingOnly,
} from "../services/api";
import { useMemo } from "react";

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    staleTime: 120 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useTodaysMatches = () => {
  return useQuery({
    queryKey: ["todaysMatches"],
    queryFn: fetchTodaysMatches,
    staleTime: 2 * 120 * 1000,
    refetchOnWindowFocus: true,
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

// ---- Live / Results / Upcoming pod-tabovi ----

export const useLiveOnlyMatches = () => {
  return useQuery({
    queryKey: ["matches", "live-tab"],
    queryFn: fetchLiveOnly,
    refetchInterval: 120000,
    staleTime: 60000,
  });
};

export const useResultsMatches = () => {
  return useQuery({
    queryKey: ["matches", "results-tab"],
    queryFn: fetchRecentResults,
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpcomingOnlyMatches = () => {
  return useQuery({
    queryKey: ["matches", "upcoming-tab"],
    queryFn: fetchUpcomingOnly,
    staleTime: 10 * 60 * 1000,
  });
};
