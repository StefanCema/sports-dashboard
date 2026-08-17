import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavTab } from "../ui/NavTab";
import type { NavTab as NavTabType } from "../../types";
import { useSearch } from "../../contexts/SearchContext";

interface TopbarProps {
  isDark: boolean;
  onToggleDark: () => void;
}

const TABS: { label: string; value: NavTabType }[] = [
  { label: "Matches", value: "/" },
  { label: "Standings", value: "/standings" },
  { label: "Stats", value: "/stats" },
  { label: "Favorites", value: "/favorites" },
];

const MATCHES_SUBPATHS = ["/", "/results", "/upcoming"];
const isTabActive = (tabValue: NavTabType, pathname: string): boolean => {
  if (tabValue === "/") return MATCHES_SUBPATHS.includes(pathname);
  return pathname === tabValue;
};

export const Topbar = ({ isDark, onToggleDark }: TopbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { query, setQuery } = useSearch();

  const handleTab = (value: NavTabType) => {
    navigate(value);
    setMenuOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (value && !MATCHES_SUBPATHS.includes(pathname)) {
      navigate("/");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 sticky top-0 z-10">
      <div className="h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Sport<span className="text-emerald-500">Live</span>
          </span>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map((tab) => (
            <NavTab
              key={tab.value}
              label={tab.label}
              active={isTabActive(tab.value, pathname)}
              onClick={() => handleTab(tab.value)}
            />
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 w-56">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search teams..."
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none w-full"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs shrink-0"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={isDark}
          className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-lg"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600 dark:bg-gray-300" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden pb-3 flex flex-col gap-1">
          {/* Mobile search */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search teams..."
              className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {TABS.map((tab) => (
            <NavTab
              key={tab.value}
              label={tab.label}
              active={isTabActive(tab.value, pathname)}
              onClick={() => handleTab(tab.value)}
            />
          ))}
        </div>
      )}
    </header>
  );
};
