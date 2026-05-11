# Orbit OS — API Integration Checklist
## Phase 2 Preparation Document · v0.3.0

> This document guides you through connecting real APIs to Orbit OS.
> All integrations currently use mock data. Replace mock services with real API calls
> by following each checklist item.

---

## 🔐 Security Rules (Read First)

> [!CAUTION]
> Never commit real API keys. Use `.env.local` locally and environment secrets in production (Vercel / Railway).

| Key | Exposure Level | Notes |
|-----|---------------|-------|
| `GEMINI_API_KEY` | ❌ Server-side only | Route: `/api/ai/*` |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | ❌ Server-side only | OAuth token exchange |
| `SPOTIFY_CLIENT_SECRET` | ❌ Server-side only | Token exchange only |
| `OPENWEATHER_API_KEY` | ⚠️ Prefer server-side | Leaking reveals billing account |
| `NEXT_PUBLIC_FIREBASE_*` | ✅ Public safe | Enforce Firestore security rules |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Public safe | Configure RLS before production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Public safe | Configure RLS before production |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Server-side only | Bypasses RLS entirely |

---

## 1. ✦ Gemini AI

### Purpose
Generate AI insights, daily briefs, signal narratives, and day recap text.

### Where it's used
- `src/app/signals/page.tsx` — signal generation
- `src/app/orbit/page.tsx` — "Generate Insight" button
- `src/app/timeline/page.tsx` — "Generate Recap" button
- `src/lib/mock-ai.ts` → replace with real server route call

### Steps
- [ ] Go to https://ai.google.dev/ and create an API key
- [ ] Add key to `.env.local` as `GEMINI_API_KEY=your_key`
- [ ] Create `src/app/api/ai/insight/route.ts` (Next.js Route Handler)
- [ ] Call Gemini `generateContent` using `@google/generative-ai` SDK
- [ ] Replace `generateInsight()` in `mock-ai.ts` with `fetch('/api/ai/insight', ...)`
- [ ] Add rate limiting and error handling to the route handler

### Mock file to replace
```
src/lib/mock-ai.ts → generateInsight(), generateDailyBatch(), generateDailyRecap()
```

---

## 2. 📅 Google Calendar API

### Purpose
Sync real calendar events to orbit rings and the timeline page.

### Where it's used
- `src/components/orbit/OrbitCanvas.tsx` — orbit ring events
- `src/app/timeline/page.tsx` — today's timeline entries
- `src/data/mockEvents.ts` — replace with real API call

### Steps
- [ ] Create a project at https://console.cloud.google.com/
- [ ] Enable "Google Calendar API"
- [ ] Create OAuth 2.0 credentials (Web Application)
- [ ] Set redirect URI: `http://localhost:3000/api/auth/google/callback`
- [ ] Add `CLIENT_ID` and `CLIENT_SECRET` to `.env.local`
- [ ] Implement OAuth flow in `src/app/api/auth/google/`
- [ ] Create `src/app/api/calendar/events/route.ts`
- [ ] Replace `eventsData` in `src/data/mockEvents.ts` with API call

### Mock file to replace
```
src/data/mockEvents.ts → eventsData[]
```

---

## 3. 🎵 Spotify Web API

### Purpose
Live now-playing track data, music mood analysis for focus correlations.

### Where it's used
- `src/components/dashboard/MusicPlayer.tsx`
- `src/app/signals/page.tsx` — music correlation signals
- `src/lib/mockData.ts` → `mockMusic`

### Steps
- [ ] Go to https://developer.spotify.com/dashboard and create an app
- [ ] Add `SPOTIFY_CLIENT_ID` to `.env.local` (public, used in PKCE)
- [ ] Add `SPOTIFY_CLIENT_SECRET` to `.env.local` (server-side only)
- [ ] Implement OAuth 2.0 PKCE flow for user login
- [ ] Create `src/app/api/spotify/now-playing/route.ts`
- [ ] Call `https://api.spotify.com/v1/me/player/currently-playing`
- [ ] Replace `mockMusic` with live API response
- [ ] Handle token refresh in the route handler

### Mock file to replace
```
src/lib/mockData.ts → mockMusic
```

---

## 4. ⛅ OpenWeather API

### Purpose
Live temperature, condition, humidity for weather widget and energy predictions.

### Where it's used
- `src/components/dashboard/WeatherBeacon.tsx`
- `src/app/signals/page.tsx` — weather signals
- `src/lib/mockData.ts` → `mockWeather`

### Steps
- [ ] Go to https://openweathermap.org/api and subscribe (free tier is sufficient)
- [ ] Add `OPENWEATHER_API_KEY` to `.env.local`
- [ ] Create `src/app/api/weather/route.ts`
- [ ] Call `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}`
- [ ] Accept user's city from profile settings
- [ ] Replace `mockWeather` with live API response

### Mock file to replace
```
src/lib/mockData.ts → mockWeather
```

---

## 5. 🔥 Firebase

### Purpose
User authentication, Firestore persistence for habits, events, signals, and settings.

### Where it's used
- Planned: all pages (replaces all mock data with real persistence)
- `src/data/mockUser.ts`, `src/data/mockEvents.ts`, `src/data/mockSignals.ts`, etc.

### Steps
- [ ] Create a project at https://console.firebase.google.com/
- [ ] Enable Authentication (Google OAuth provider)
- [ ] Create a Firestore database
- [ ] Copy your app config from Firebase Console
- [ ] Add all `NEXT_PUBLIC_FIREBASE_*` variables to `.env.local`
- [ ] Install: `npm install firebase`
- [ ] Create `src/lib/firebase.ts` to initialize app
- [ ] Create `src/lib/firestore.ts` with typed CRUD helpers
- [ ] **Configure Firestore Security Rules** before production

> [!IMPORTANT]
> Firestore has no Row-Level Security by default. Without rules, anyone can read/write your database.
> Always configure rules at https://console.firebase.google.com/ before deploying.

---

## 6. ⚡ Supabase (Alternative to Firebase)

### Purpose
Postgres-backed database with auth, storage, and real-time for all data persistence.

### Where it's used
- Planned: complete data layer alternative to Firebase

### Steps
- [ ] Create a project at https://app.supabase.com/
- [ ] Copy Project URL and anon key from Settings → API
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (server-side only)
- [ ] Install: `npm install @supabase/supabase-js`
- [ ] Create `src/lib/supabase.ts` for client/server instances
- [ ] Design tables: `users`, `events`, `habits`, `signals`, `focus_sessions`
- [ ] **Configure Row-Level Security (RLS) policies** on all tables

> [!IMPORTANT]
> Supabase anon key is public, but without RLS policies, any user can access all data.
> Enable RLS and add policies for every table before production.

---

## Quick Reference: Mock → Real Replacements

| Mock File | Real Replacement Strategy |
|-----------|--------------------------|
| `src/lib/mock-ai.ts` | Next.js route handler → Gemini API |
| `src/data/mockEvents.ts` | Google Calendar API route handler |
| `src/data/mockSignals.ts` | Generated by Gemini + stored in DB |
| `src/data/mockTimeline.ts` | Built from real events + AI narrative |
| `src/data/mockUser.ts` | Firebase/Supabase user profile |
| `src/data/mockConstellations.ts` | Computed from real habit + event data |
| `src/lib/mockData.ts` → `mockWeather` | OpenWeather API route handler |
| `src/lib/mockData.ts` → `mockMusic` | Spotify API route handler |
| `src/lib/mockData.ts` → `mockHabits` | Firebase/Supabase `habits` collection |

---

## Recommended Integration Order (Phase 2)

1. **Firebase Auth** — login/logout first, everything depends on user identity
2. **Supabase or Firestore** — persist habits and events from mock data
3. **OpenWeather** — quick win, single API call
4. **Spotify** — OAuth flow adds music mood data
5. **Google Calendar** — OAuth flow, syncs real events to orbit
6. **Gemini AI** — last, as it synthesizes all other data for insights

---

*Generated by Orbit OS Phase 3 · May 2026*
