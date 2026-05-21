# SportLive Dashboard

A real-time sports dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- Live match tracking with auto-refresh every 30 seconds
- Filter matches by sport (Football, Basketball, Tennis, Baseball)
- Live / Upcoming / Finished match sections
- Animated live indicator for ongoing matches
- Match statistics (possession, shots, corners, rebounds)
- Responsive sidebar with today's overview and upcoming matches

## Tech Stack

- **React 19** — UI framework
- **TypeScript** — type safety
- **Tailwind CSS** — styling
- **React Query (@tanstack/react-query)** — data fetching and caching
- **Vite** — build tool

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── layout/      # Topbar, Sidebar
│   ├── matches/     # MatchCard, MatchList, LiveBadge
│   └── ui/          # FilterChip, NavTab
├── hooks/           # useMatches (React Query)
├── services/        # API layer
├── types/           # TypeScript interfaces
└── pages/           # Page components
```