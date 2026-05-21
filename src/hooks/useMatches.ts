import { useQuery } from '@tanstack/react-query';
import { fetchLiveMatches, fetchTodaysMatches } from '../services/api';
import type { Match, SportFilter } from '../types';

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ['liveMatches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
    staleTime: 20000,
  });
};

export const useTodaysMatches = () => {
  return useQuery({
    queryKey: ['todaysMatches'],
    queryFn: fetchTodaysMatches,
    refetchInterval: 60000, 
    staleTime: 30000,
  });
};

export const useFilteredMatches = (filter: SportFilter) => {
  const live = useLiveMatches();
  const todays = useTodaysMatches();

  const allMatches: Match[] = [
    ...(live.data ?? []),
    ...(todays.data ?? []),
  ];

  const filtered = filter === 'all'
    ? allMatches
    : allMatches.filter(m => m.sport === filter);

  return {
    matches: filtered,
    isLoading: live.isLoading || todays.isLoading,
    isError: live.isError || todays.isError,
  };
};