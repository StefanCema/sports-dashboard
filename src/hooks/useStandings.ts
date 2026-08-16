import { useQuery } from "@tanstack/react-query";
import { fetchStandings, fetchCompetitionForm } from "../services/api";

export const useStandings = (competitionCode: string) => {
  return useQuery({
    queryKey: ["standings", competitionCode],
    queryFn: () => fetchStandings(competitionCode),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompetitionForm = (competitionCode: string) => {
  return useQuery({
    queryKey: ["competitionForm", competitionCode],
    queryFn: () => fetchCompetitionForm(competitionCode),
    staleTime: 10 * 60 * 1000,
  });
};
