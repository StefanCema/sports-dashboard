import { useUpcomingOnlyMatches } from '../../hooks/useMatches';
import { MatchListView } from './MatchListView';

export const UpcomingPage = () => {
  const { data, isLoading, isError } = useUpcomingOnlyMatches();

  return (
    <MatchListView
      matches={data ?? []}
      isLoading={isLoading}
      isError={isError}
      heading="Upcoming fixtures"
      emptyText="No upcoming matches."
      errorText="Failed to load upcoming fixtures."
    />
  );
};
