# SportLive ⚽

A React + TypeScript sports dashboard for browsing football (soccer) matches, league tables, top scorers, and team profiles — built with real, live data from [football-data.org](https://www.football-data.org/).

> Personal portfolio project built to demonstrate React/TypeScript proficiency: data fetching & caching strategy, nested routing, state management, and working around the real-world constraints of a free third-party API (rate limits, CORS, delayed data).

\*\*[Live demo →]https://sports-dashboard-pmp277vjf-stefancemas-projects.vercel.app/upcoming

---

## Features

- **Live / Results / Upcoming** — matches split into three independently-loaded views, grouped by league, with a collapsible section per league
- **Standings** — full league table with each team's crest and recent form (last 5 results, W/D/L)
- **Top Scorers** — ranked goal/assist leaders per league
- **Match details** — score, half-time score, venue, referee, and head-to-head history between the two teams
- **Team profiles** — club info, current form, and full squad grouped by position
- **Search** — filters matches by team name across all match views
- **Favorites** — save matches, persisted in `localStorage`
- **Filters** — by sport and by league (multi-select), both hidden automatically when there's nothing to filter
- **Dark mode**
- Fully responsive, with a mobile navigation menu

## Tech stack

- **React 18** + **TypeScript**
- **Vite**
- **React Router** (nested routes for the Live/Results/Upcoming sub-tabs)
- **TanStack Query (React Query)** — caching, background refetch, and rate-limit-aware retry logic
- **Tailwind CSS**
- Data from the [football-data.org](https://www.football-data.org/documentation/quickstart) REST API (free tier)

## Getting started

### 1. Clone and install

```bash
git clone <https://github.com/StefanCema/sports-dashboard>
cd sportlive
npm install
```

### 2. Get a free API key

This project uses the free tier of [football-data.org](https://www.football-data.org/client/register). Registration is free and instant — no card required.

### 3. Configure your environment

Copy `.env.example` to `.env` in the project root and add your token:

```
VITE_FOOTBALL_DATA_TOKEN=your_token_here
```

### 4. Run it

```bash
npm run dev
```

Open `http://localhost:5173`.

## Why there's a dev proxy

football-data.org's free tier returns a fixed `Access-Control-Allow-Origin: http://localhost` header (without a port), which browsers reject when the dev server runs on a different port (e.g. `:5173`). `vite.config.ts` includes a dev-only proxy that forwards `/api/football/*` requests server-side, where CORS doesn't apply, and attaches the API token there instead of in the browser.

This proxy only works with `npm run dev`. **A production deployment needs an equivalent serverless function** (e.g. a Vercel/Netlify function) to proxy the same requests — see [Deployment](#deployment) below.

## Known limitations

These are constraints of the free data tier, not bugs:

- **Football only.** The UI has sport-filter plumbing for basketball/tennis/baseball, but no free, reliable, CORS-friendly API was available for those, so only football has real data. The sport filter automatically hides itself when there's nothing to filter.
- **~12 competitions.** Free tier covers major leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, and a few others) — not every league or lower division worldwide.
- **Scores are delayed, not truly real-time.** football-data.org's free tier does not guarantee instant live updates; "live" status can lag behind the real match by some minutes.
- **10 requests/minute, shared across the whole app.** All API calls (including background polling) share this budget. The app is built to stay well under it (see below), but rapid navigation across many pages in a short window can still occasionally hit a `429`.
- **Match events (goal scorers, cards, lineups) are a paid feature** on football-data.org and aren't available here.

## Notes on the API integration

A few things worth mentioning if you're reviewing this code:

- **Rate-limit-aware retries.** React Query's default retry behavior was replaced with logic that never auto-retries on `429` (rate limited) or `404` — retrying those just makes things worse, not better.
- **Minimal request footprint.** Standings' per-team "form" (last 5 results) is computed from a **single** request for the whole league's recent matches, not one request per team — fetching form for a 20-team league the naive way would nearly exhaust the entire per-minute budget on its own.
- **Merged requests.** Match detail (score, venue, referee) and the base match data come from one request, not two, even though they could naturally be split across two functions.
- **Direct-by-ID lookups.** Match and Favorites detail pages fetch by ID directly rather than filtering through an already-loaded, time-windowed list — a match outside that window would otherwise appear to "not exist" even though it does.

## Project structure

```
src/
  components/
    layout/       Topbar, Sidebar
    matches/       MatchCard, MatchListView, TeamCrest, FormBadges, LiveBadge
    ui/            Dropdown, LeagueTabs, NavTab, FilterChip, skeletons
  contexts/        Favorites, Search (global UI state)
  hooks/           React Query hooks per data domain
  pages/           Route-level pages
  services/api.ts  All football-data.org calls + response mapping
  types/           Shared TypeScript types
```

## Deployment

Deployed on **Vercel**. The dev proxy in `vite.config.ts` only works with `npm run dev` — production uses a Vercel serverless function (`api/football/[...path].js`) that does the same job: forward requests to football-data.org server-side, with the token attached there instead of in the browser. No frontend code changes are needed between dev and production since both resolve the same relative `/api/football/*` path.

**To deploy your own copy:**

1. Push the project to GitHub (includes the `api/` folder — don't skip it).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and import the repo. Vercel auto-detects the Vite framework — no config needed.
3. Before the first deploy (or right after, then redeploy), go to **Project Settings → Environment Variables** and add:
   - `FOOTBALL_DATA_TOKEN` = your football-data.org token (**not** prefixed with `VITE_` — it must stay server-side only)
4. Deploy. Vercel will auto-redeploy on every push to the connected branch from then on.

`.env` (with `VITE_FOOTBALL_DATA_TOKEN`) is still used for local development — it is not read in production; the Vercel environment variable above is what the serverless function uses instead.

## License

Personal portfolio project — free to use as a reference.
