import { useQuery } from "@tanstack/react-query";
import { fetchMatchFull, fetchHeadToHead } from "../services/api";

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
