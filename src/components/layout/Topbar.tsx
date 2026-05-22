import { useState } from 'react';
import { NavTab } from '../ui/NavTab';
import type { NavTab as NavTabType } from '../../types';

interface TopbarProps {
  activeTab: NavTabType;
  onTabChange: (tab: NavTabType) => void;
}

const TABS: { label: string; value: NavTabType }[] = [
  { label: 'Matches', value: 'matches' },
  { label: 'Standings', value: 'standings' },
  { label: 'Stats', value: 'stats' },
  { label: 'Favorites', value: 'favorites' },
];

export const Topbar = ({ activeTab, onTabChange }: TopbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 px-6 sticky top-0 z-10">
      <div className="h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            Sport<span className="text-emerald-500">Live</span>
          </span>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map(tab => (
            <NavTab
              key={tab.value}
              label={tab.label}
              active={activeTab === tab.value}
              onClick={() => onTabChange(tab.value)}
            />
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <span className="text-sm text-gray-400">Search teams...</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-50"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <div className="w-5 h-0.5 bg-gray-600 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600 mb-1" />
          <div className="w-5 h-0.5 bg-gray-600" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden pb-3 flex flex-col gap-1">
          {TABS.map(tab => (
            <NavTab
              key={tab.value}
              label={tab.label}
              active={activeTab === tab.value}
              onClick={() => {
                onTabChange(tab.value);
                setMenuOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </header>
  );
};