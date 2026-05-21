import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { MatchList } from './components/matches/MatchList';
import type { NavTab } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('matches');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Topbar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="max-w-6xl mx-auto px-6 py-6 flex gap-6">
          {/* Main content */}
          <div className="flex-1">
            {activeTab === 'matches' && <MatchList />}
            {activeTab === 'standings' && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-sm">Standings — coming soon</p>
              </div>
            )}
            {activeTab === 'stats' && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-sm">Stats — coming soon</p>
              </div>
            )}
            {activeTab === 'favorites' && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400 text-sm">Favorites — coming soon</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;