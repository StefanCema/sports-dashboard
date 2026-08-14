import { NavLink, Outlet } from "react-router-dom";

const SUB_TABS = [
  { label: "Live", path: "/", end: true },
  { label: "Results", path: "/results", end: false },
  { label: "Upcoming", path: "/upcoming", end: false },
];

export const MatchesTabs = () => {
  return (
    <div>
      <div className="flex gap-2 mb-5">
        {SUB_TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) => `
              px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150
              ${
                isActive
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
};
