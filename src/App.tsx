import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Topbar } from "./components/layout/Topbar";
import { Sidebar } from "./components/layout/Sidebar";
import { MatchList } from "./components/matches/MatchList";
import { MatchDetailPage } from "./pages/MatchDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { StandingsPage } from "./pages/StandingsPage";
import { useDarkMode } from "./hooks/useDarkMode";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { StatsPage } from "./pages/StatsPage";
import { SearchProvider } from "./contexts/SearchContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6">
    <div className="flex-1">{children}</div>
    <div className="hidden md:block">
      <Sidebar />
    </div>
  </main>
);

const App = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <SearchProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Topbar isDark={isDark} onToggleDark={toggleDarkMode} />

              <Routes>
                <Route path="/match/:id" element={<MatchDetailPage />} />

                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <MatchList />
                    </MainLayout>
                  }
                />
                <Route
                  path="/standings"
                  element={
                    <MainLayout>
                      <StandingsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <MainLayout>
                      <FavoritesPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/stats"
                  element={
                    <MainLayout>
                      <StatsPage />
                    </MainLayout>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </SearchProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
};

export default App;
