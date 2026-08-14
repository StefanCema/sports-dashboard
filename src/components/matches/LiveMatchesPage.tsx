import { useLiveOnlyMatches } from '../../hooks/useMatches';
import { MatchListView } from './MatchListView';

export const LiveMatchesPage = () => {
  const { data, isLoading, isError } = useLiveOnlyMatches();

  return (
    <MatchListView
      matches={data ?? []}
      isLoading={isLoading}
      isError={isError}
      heading="Live now"
      emptyText="No live matches right now."
      errorText="Failed to load live matches."
    />
  );
};
