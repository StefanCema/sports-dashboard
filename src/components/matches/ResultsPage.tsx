import { useResultsMatches } from '../../hooks/useMatches';
import { MatchListView } from './MatchListView';

export const ResultsPage = () => {
  const { data, isLoading, isError } = useResultsMatches();

  return (
    <MatchListView
      matches={data ?? []}
      isLoading={isLoading}
      isError={isError}
      heading="Recent results"
      emptyText="No recent results."
      errorText="Failed to load results."
    />
  );
};
