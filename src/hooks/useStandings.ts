import { useQuery } from "@tanstack/react-query";
import { fetchStandings } from "../services/api";

export const useStandings = (competitionCode: string) => {
  return useQuery({
    queryKey: ["standings", competitionCode],
    queryFn: () => fetchStandings(competitionCode),
    staleTime: 5 * 60 * 1000,
  });
};
