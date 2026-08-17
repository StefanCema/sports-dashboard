export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-3 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Teams + Score */}
      <div className="flex items-center">
        <div className="flex-1">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-full mb-1.5" />
          <div className="h-3 w-10 bg-gray-100 dark:bg-gray-700 rounded-full" />
        </div>

        <div className="text-center px-4">
          <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        <div className="flex-1 flex flex-col items-end">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-full mb-1.5" />
          <div className="h-3 w-10 bg-gray-100 dark:bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonList = () => {
  return (
    <div>
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 animate-pulse" />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};
