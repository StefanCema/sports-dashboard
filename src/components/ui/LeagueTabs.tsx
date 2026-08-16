import { LEAGUES } from '../../constants/leagues';

interface LeagueTabsProps {
  active: string;
  onChange: (code: string) => void;
}

// Ranije je ovaj blok bio kopiran identicno u StandingsPage i StatsPage.
// Izvuceno ovde da postoji jedno mesto za izmenu (npr. stil, dodavanje lige).
export const LeagueTabs = ({ active, onChange }: LeagueTabsProps) => {
  return (
    <div className="flex gap-2 mb-5 flex-wrap">
      {LEAGUES.map(league => (
        <button
          key={league.code}
          onClick={() => onChange(league.code)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
            ${active === league.code
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
            }`}
        >
          {league.flag ? (
            <img
              src={league.flag}
              alt={`${league.label} logo`}
              className="h-5 w-5 inline-block object-contain align-middle"
              onError={e => {
                // Ako logo ne ucita, sakrij <img> i pusti da tekst ostane vidljiv
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          <span className={league.flag ? 'ml-1.5' : ''}>{league.label}</span>
        </button>
      ))}
    </div>
  );
};
