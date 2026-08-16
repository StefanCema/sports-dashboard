import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../hooks/useMatchDetail';
import { TeamCrest } from '../components/matches/TeamCrest';
import type { SquadPlayer } from '../services/api';

// football-data.org vraca dosta granularne pozicije (npr. "Centre-Back",
// "Defensive Midfield", "Right Winger"...) — grupisemo ih u 4 siroke
// kategorije radi preglednijeg prikaza sastava.
const categorize = (position: string | null): string => {
  if (!position) return 'Other';
  const p = position.toLowerCase();
  if (p.includes('keeper')) return 'Goalkeepers';
  if (p.includes('back') || p.includes('defence') || p.includes('defender')) return 'Defenders';
  if (p.includes('midfield')) return 'Midfielders';
  if (p.includes('forward') || p.includes('winger') || p.includes('striker') || p.includes('attack')) {
    return 'Forwards';
  }
  return 'Other';
};

const CATEGORY_ORDER = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards', 'Other'];

const calculateAge = (dateOfBirth: string | null): number | null => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
};

const groupSquad = (squad: SquadPlayer[]): [string, SquadPlayer[]][] => {
  const groups = new Map<string, SquadPlayer[]>();
  for (const player of squad) {
    const category = categorize(player.position);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(player);
  }
  return CATEGORY_ORDER.filter(c => groups.has(c)).map(c => [c, groups.get(c)!]);
};

export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: team, isLoading, isError } = useTeam(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        Loading team...
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-400 text-sm">Team not found.</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          ← Back to matches
        </button>
      </div>
    );
  }

  const squadGroups = groupSquad(team.squad);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <TeamCrest src={team.crest} alt={team.name} size={56} />
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {team.name}
            </h1>
            {team.venue && (
              <p className="text-sm text-gray-400 mt-0.5">{team.venue}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {team.founded && (
            <div>
              <span className="text-gray-400">Founded </span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">{team.founded}</span>
            </div>
          )}
          {team.coach && (
            <div>
              <span className="text-gray-400">Coach </span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">{team.coach}</span>
            </div>
          )}
          {team.clubColors && (
            <div>
              <span className="text-gray-400">Colors </span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">{team.clubColors}</span>
            </div>
          )}
          {team.website && (
            <a
              href={team.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Website ↗
            </a>
          )}
        </div>

        {team.runningCompetitions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
            {team.runningCompetitions.map(comp => (
              <span
                key={comp}
                className="text-xs px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                {comp}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Squad */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
          Squad
        </p>

        {squadGroups.length === 0 && (
          <p className="text-sm text-gray-400">No squad data available.</p>
        )}

        {squadGroups.map(([category, players]) => (
          <div key={category} className="mb-5 last:mb-0">
            <p className="text-xs font-medium text-gray-400 mb-2">{category}</p>
            <div className="flex flex-col">
              {players.map((player, i) => {
                const age = calculateAge(player.dateOfBirth);
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between text-sm py-2 ${
                      i !== 0 ? 'border-t border-gray-50 dark:border-gray-700' : ''
                    }`}
                  >
                    <span className="text-gray-700 dark:text-gray-200">{player.name}</span>
                    <span className="text-xs text-gray-400">
                      {player.nationality}
                      {age !== null ? ` · ${age}y` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
