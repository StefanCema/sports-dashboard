const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

// ---- Standings tabela ----
const SkeletonStandingsRow = () => (
  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gray-50 dark:border-gray-700 last:border-b-0 animate-pulse">
    <Bar className="col-span-1 h-3 w-4" />
    <div className="col-span-3 flex items-center gap-2">
      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
      <Bar className="h-3 w-20" />
    </div>
    <div className="col-span-3 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700"
        />
      ))}
    </div>
    <Bar className="h-3 w-4 mx-auto" />
    <Bar className="h-3 w-4 mx-auto" />
    <Bar className="h-3 w-4 mx-auto" />
    <Bar className="h-3 w-4 mx-auto" />
    <Bar className="h-3 w-6 mx-auto" />
  </div>
);

export const SkeletonStandingsTable = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonStandingsRow key={i} />
    ))}
  </div>
);

// ---- Top Scorers tabela ----
const SkeletonScorerRow = () => (
  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gray-50 dark:border-gray-700 last:border-b-0 animate-pulse">
    <Bar className="col-span-1 h-3 w-4" />
    <div className="col-span-5">
      <Bar className="h-3 w-28 mb-1.5" />
      <Bar className="h-2.5 w-16" />
    </div>
    <div className="col-span-3 flex items-center gap-2">
      <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
      <Bar className="h-3 w-16" />
    </div>
    <Bar className="h-3 w-4 mx-auto" />
    <Bar className="h-3 w-4 mx-auto" />
    <Bar className="h-3 w-4 mx-auto" />
  </div>
);

export const SkeletonScorersTable = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonScorerRow key={i} />
    ))}
  </div>
);

// ---- Team Detail stranica ----
export const SkeletonTeamPage = () => (
  <div className="max-w-2xl mx-auto px-6 py-8 animate-pulse">
    <Bar className="h-4 w-12 mb-6" />

    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 mb-4">
      <div className="flex items-center gap-4 mb-5">
        <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div>
          <Bar className="h-5 w-40 mb-2" />
          <Bar className="h-3 w-28" />
        </div>
      </div>
      <div className="flex gap-6">
        <Bar className="h-3 w-20" />
        <Bar className="h-3 w-20" />
        <Bar className="h-3 w-20" />
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
      <Bar className="h-3 w-16 mb-4" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Bar key={i} className="h-4 mb-3 last:mb-0" />
      ))}
    </div>
  </div>
);

// ---- Match Detail stranica ----
export const SkeletonMatchPage = () => (
  <div className="max-w-2xl mx-auto px-6 py-8 animate-pulse">
    <Bar className="h-4 w-12 mb-6" />

    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 mb-4">
      <div className="flex items-center justify-between mb-6">
        <Bar className="h-3 w-24" />
        <Bar className="h-3 w-10" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700" />
          <Bar className="h-4 w-20" />
        </div>
        <Bar className="h-8 w-16" />
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700" />
          <Bar className="h-4 w-20" />
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
      <Bar className="h-3 w-24 mb-4" />
      <Bar className="h-4 w-full" />
    </div>
  </div>
);
