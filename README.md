# 🪐 Orbit OS

> A cinematic, AI-powered personal operating system — visualize your day as a living digital galaxy.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-pink)](https://framer.com/motion)

---

## What is Orbit OS?

Orbit OS is not a task manager or calendar dashboard. It's a **futuristic personal operating system** where your daily schedule, energy, habits, music, weather, and AI insights appear like planets, signals, and constellations around a central glowing orb.

**Target users:** Students, software developers, creators, and busy people who want a beautiful, emotional, AI-powered way to understand their day.

**Core feeling:** Cinematic · Ambient · Futuristic · Emotional · Premium · Calm · Intelligent

---

## Features

| Phase | Features |
|-------|---------|
| ✅ Phase 1 | Architecture, data models, mock data layer |
| ✅ Phase 2 | Design system — dark space UI, glassmorphism, animations |
| ✅ Phase 3 | Interactive orbit dashboard, AI insight simulation, mock APIs |
| ✅ Phase 4 | Secure server-side API integration (Gemini, Spotify, Google Calendar, OpenWeather) |
| ✅ Phase 4.5 | Fully responsive — mobile, tablet, desktop |
| 🔜 Phase 5 | Persistent database, Firebase/Supabase auth, real-time sync |

### Pages
- **Orbit** — The main galaxy dashboard: animated orbit canvas, mood selector, energy tracker, AI insights
- **Timeline** — Today/week/month view with AI-generated day recap
- **Signals** — AI-generated insights, recommendations, and pattern alerts
- **Constellations** — Habit tracking map and data correlation visualization
- **Settings** — API key management, OAuth connections, appearance controls

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + custom design system |
| Animation | Framer Motion 12 |
| AI | Google Gemini 1.5-Flash (server-side) |
| Calendar | Google Calendar API v3 (OAuth 2.0) |
| Music | Spotify Web API (OAuth 2.0) |
| Weather | OpenWeather API |
| Auth tokens | httpOnly cookies (Phase 4) → Database (Phase 5) |

---

## Getting Started

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/ozanggnr/orbit-os.git
cd orbit-os

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in your API keys (all optional — app works with mock data)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app works **immediately without any API keys** — all features fall back to rich mock data.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you want to enable:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Google Gemini AI key — enables real AI insights |
| `OPENWEATHER_API_KEY` | Optional | OpenWeather key — enables live weather |
| `GOOGLE_CALENDAR_CLIENT_ID/SECRET` | Optional | Google OAuth — enables real calendar events |
| `SPOTIFY_CLIENT_ID/SECRET` | Optional | Spotify OAuth — enables real music data |

See `.env.example` for the full list with setup instructions.

> **Security:** Never commit `.env.local`. It's gitignored. Only `.env.example` (with empty placeholders) is committed.

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Service configuration status |
| `/api/ai/daily-insight` | POST | Gemini AI insight (mock fallback) |
| `/api/weather/current` | GET | Current weather (mock fallback) |
| `/api/calendar/events` | GET | Today's calendar events (mock fallback) |
| `/api/spotify/recently-played` | GET | Recent tracks (mock fallback) |
| `/api/auth/google/start` | GET | Google OAuth initiation |
| `/api/auth/google/callback` | GET | Google OAuth callback |
| `/api/auth/spotify/start` | GET | Spotify OAuth initiation |
| `/api/auth/spotify/callback` | GET | Spotify OAuth callback |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── orbit/             # Main dashboard
│   ├── timeline/          # Day/week/month timeline
│   ├── signals/           # AI signal feed
│   ├── constellations/    # Habit constellation map
│   ├── settings/          # API & preferences
│   └── api/               # Server-side API routes
├── components/
│   ├── layout/            # AppShell, SideNav, TopBar
│   ├── orbit/             # OrbitCanvas, CentralOrb, PlanetNode
│   ├── dashboard/         # Page-specific widgets
│   └── ui/                # Primitives (GlassPanel, MetricPill, etc.)
├── lib/
│   ├── server/            # Server-only API service modules
│   ├── client/            # Client-side API utility (calls internal routes)
│   ├── mock-ai.ts         # Deterministic mock AI system
│   └── mockData.ts        # Development mock data
├── data/                  # Static mock data files
└── types/                 # Shared TypeScript interfaces
docs/
├── PHASE_4_API_LAYER.md   # API architecture documentation
├── RESPONSIVE_CHECKLIST.md # Responsive design testing guide
└── RAILWAY_DEPLOYMENT.md   # Deployment guide
```

---

## Deployment

See [docs/RAILWAY_DEPLOYMENT.md](docs/RAILWAY_DEPLOYMENT.md) for full Railway deployment instructions.

```bash
# Production build (verify before deploying)
npm run build

# Production server
npm run start
```

---

## Security Model

- ✅ All external API calls are server-side only (Next.js Route Handlers)
- ✅ API keys never reach the browser
- ✅ OAuth tokens stored in httpOnly cookies
- ✅ `.env.local` is gitignored — only `.env.example` (no secrets) is committed
- ✅ CSRF state validation on all OAuth flows

---

## Documentation

| Doc | Description |
|-----|-------------|
| [.env.example](.env.example) | Environment variable template with instructions |
| [docs/PHASE_4_API_LAYER.md](docs/PHASE_4_API_LAYER.md) | API integration architecture |
| [docs/RESPONSIVE_CHECKLIST.md](docs/RESPONSIVE_CHECKLIST.md) | Responsive design test guide |
| [docs/RAILWAY_DEPLOYMENT.md](docs/RAILWAY_DEPLOYMENT.md) | Railway deployment step-by-step |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with ☕ and too many late nights. Orbit OS is an ongoing personal project.*
