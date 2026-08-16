import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchMatchFull, fetchHeadToHead } from "../services/api";
import type { Match } from "../types";

export const useMatchFull = (matchId: string | undefined) => {
  return useQuery({
    queryKey: ["matchFull", matchId],
    queryFn: () => fetchMatchFull(matchId as string),
    enabled: !!matchId,
    staleTime: 60 * 1000,
  });
};

export const useHeadToHead = (matchId: string | undefined) => {
  return useQuery({
    queryKey: ["headToHead", matchId],
    queryFn: () => fetchHeadToHead(matchId as string),
    enabled: !!matchId,
    staleTime: 20 * 60 * 1000, // istorijat se prakticno ne menja
  });
};

export const useFavoriteMatches = (matchIds: string[]) => {
  const results = useQueries({
    queries: matchIds.map((id) => ({
      queryKey: ["matchFull", id],
      queryFn: () => fetchMatchFull(id),
      staleTime: 60 * 1000,
    })),
  });

  const matches = results
    .map((r) => r.data?.match)
    .filter((m): m is Match => !!m);

  const isLoading = results.some((r) => r.isLoading);
  const isError = matchIds.length > 0 && results.every((r) => r.isError);

  return { matches, isLoading, isError };
};
