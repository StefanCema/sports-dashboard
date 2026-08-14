import { useQuery } from "@tanstack/react-query";
import { fetchTopScorers } from "../services/api";

export const useTopScorers = (competitionCode: string) => {
  return useQuery({
    queryKey: ["scorers", competitionCode],
    queryFn: () => fetchTopScorers(competitionCode),
    staleTime: 5 * 60 * 1000,
  });
};
