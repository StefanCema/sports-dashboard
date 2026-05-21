import { useState } from 'react';
import { MatchCard } from './MatchCard';
import { FilterChip } from '../ui/FilterChip';
import { useFilteredMatches } from '../../hooks/useMatches';
import type { SportFilter } from '../../types';

const FILTERS: { label: string; value: SportFilter }[] = [
  { label: 'All Sports', value: 'all' },
  { label: 'Football', value: 'football' },
  { label: 'Basketball', value: 'basketball' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Baseball', value: 'baseball' },
];

export const MatchList = () => {
  const [activeFilter, setActiveFilter] = useState<SportFilter>('all');
  const { matches, isLoading, isError } = useFilteredMatches(activeFilter);

  const liveMatches = matches.filter(m => m.status === 'live');
  const finishedMatches = matches.filter(m => m.status === 'finished');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Failed to load matches. Try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {FILTERS.map(f => (
          <FilterChip
            key={f.value}
            label={f.label}
            active={activeFilter === f.value}
            onClick={() => setActiveFilter(f.value)}
          />
        ))}
      </div>

      {/* Live */}
      {liveMatches.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Live Now
          </p>
          {liveMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {/* Upcoming */}
      {upcomingMatches.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Upcoming
          </p>
          {upcomingMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {/* Finished */}
      {finishedMatches.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Finished Today
          </p>
          {finishedMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

      {/* Prazan state */}
      {matches.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">No matches found.</p>
        </div>
      )}
    </div>
  );
};