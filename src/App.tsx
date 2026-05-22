import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { MatchList } from './components/matches/MatchList';
import { MatchDetailPage } from './pages/MatchDetailPage';
import type { NavTab } from './types';
import { FavoritesPage } from './pages/FavoritesPage';

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
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Topbar activeTab={activeTab} onTabChange={setActiveTab} />

          <Routes>
            {/* Match detail — bez sidebara */}
            <Route path="/match/:id" element={<MatchDetailPage />} />

            {/* Home — sa sidebarom */}
            <Route
              path="/"
              element={
                <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6">
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
                    {activeTab === 'favorites' && <FavoritesPage />}
                  </div>

                  {/* Sidebar — sakriven na mobilnom */}
                  <div className="hidden md:block">
                    <Sidebar />
                  </div>
                </main>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;