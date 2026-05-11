# Orbit OS — Phase 4 API Layer
## Architecture & Developer Reference · v0.4.0

---

## Overview

Phase 4 adds a **secure server-side API integration layer** to Orbit OS. All external API calls go through Next.js Route Handlers — client components never touch external APIs directly.

```
Browser (Client)
    │
    │  fetch('/api/...')          ← internal only
    ▼
Next.js Route Handlers           ← runs on Node.js server
    │
    │  Uses process.env secrets  ← never sent to client
    ▼
External APIs (Gemini, OpenWeather, Google, Spotify)
```

---

## Route Structure

| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Service configuration status |
| `/api/ai/daily-insight` | POST | Gemini AI insight generation |
| `/api/weather/current` | GET | OpenWeather current conditions |
| `/api/calendar/events` | GET | Today's Google Calendar events |
| `/api/auth/google/start` | GET | Begin Google OAuth flow |
| `/api/auth/google/callback` | GET | Handle Google OAuth callback |
| `/api/auth/spotify/start` | GET | Begin Spotify OAuth flow |
| `/api/auth/spotify/callback` | GET | Handle Spotify OAuth callback |
| `/api/spotify/recently-played` | GET | Recent Spotify tracks |

---

## Server-Side Services

Each external API has a dedicated server-only service file:

| File | Purpose |
|------|---------|
| `src/lib/server/gemini.ts` | Gemini AI content generation |
| `src/lib/server/weather.ts` | OpenWeather current conditions |
| `src/lib/server/googleCalendar.ts` | Google Calendar OAuth + events |
| `src/lib/server/spotify.ts` | Spotify OAuth + recently played |

**Rule:** These files are **never** imported by client components. They are imported only by Route Handlers.

---

## Fallback System

Every service follows the same pattern:

```typescript
if (!apiKey) {
  console.info('[Service] No key — returning mock fallback');
  return getMockData();  // Always returns valid data
}

try {
  const result = await callExternalAPI();
  return normalizeResult(result);
} catch (err) {
  console.error('[Service] Error:', err);
  return getMockData();  // Graceful degradation
}
```

The `source` field in every response tells the UI where data came from:
- `"gemini"` — real Gemini API response
- `"openweather"` — real OpenWeather response
- `"google-calendar"` — real Google Calendar data
- `"spotify"` — real Spotify data
- `"mock-fallback"` — key missing or API call failed

---

## Client API Utilities

`src/lib/client/api.ts` provides typed wrapper functions:

```typescript
import { getDailyInsight, getCurrentWeather, getCalendarEvents, getRecentlyPlayed, getHealth } from '@/lib/client/api';

// Call real AI (or get mock fallback)
const insight = await getDailyInsight({ mood: 'focused', energy: 74, ... });

// Get live weather (or mock if key missing)
const weather = await getCurrentWeather({ city: 'Istanbul' });

// Check service configuration status
const health = await getHealth();
// → { services: { gemini: 'configured', openweather: 'missing', ... } }
```

---

## How to Test Each Route

### 1. Health Check (always works)
```bash
curl http://localhost:3000/api/health
```
```json
{
  "status": "ok",
  "services": {
    "gemini": "missing",
    "openweather": "missing",
    "googleCalendar": { "credentials": "missing", "authenticated": false },
    "spotify": { "credentials": "missing", "authenticated": false }
  }
}
```

### 2. Weather (returns mock when key missing)
```bash
curl "http://localhost:3000/api/weather/current"
curl "http://localhost:3000/api/weather/current?city=Istanbul&country=TR"
curl "http://localhost:3000/api/weather/current?lat=41.01&lon=28.95"
```

### 3. AI Insight (returns mock when key missing)
```bash
curl -X POST http://localhost:3000/api/ai/daily-insight \
  -H "Content-Type: application/json" \
  -d '{"mood":"focused","energy":74,"events":[],"weather":{},"focusSessions":3,"streak":8,"focusHoursToday":4.5}'
```

### 4. Calendar Events (returns mock when not authenticated)
```bash
curl http://localhost:3000/api/calendar/events
```

### 5. Spotify Recently Played (returns mock when not authenticated)
```bash
curl http://localhost:3000/api/spotify/recently-played?limit=5
```

### 6. Start OAuth (redirects to provider)
```
http://localhost:3000/api/auth/google/start
http://localhost:3000/api/auth/spotify/start
```
> These will return a 503 error if credentials are not configured — this is expected.

---

## Token Storage (Current: httpOnly Cookies)

OAuth tokens are currently stored in **httpOnly, SameSite=Lax cookies**:

| Cookie | Contents | Max Age |
|--------|----------|---------|
| `gcal_access_token` | Google access token | `expires_in` (3600s) |
| `spotify_access_token` | Spotify access token | `expires_in` (3600s) |
| `spotify_oauth_state` | CSRF state | 600s |

> [!WARNING]
> This is a **prototype-grade** implementation. Access tokens expire in 1 hour and are not automatically refreshed. See Phase 5 todos below.

### Phase 5 TODOs for Production
- [ ] Encrypt tokens before storage
- [ ] Store encrypted tokens in database (Supabase / Firebase)
- [ ] Implement refresh token rotation
- [ ] Add per-user token storage keyed by user ID
- [ ] Evaluate NextAuth.js for full production auth management
- [ ] Set `secure: true` cookies on production deployment

---

## Adding Real API Keys (Quick Start)

1. Copy the template:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your keys:
   ```env
   GEMINI_API_KEY=your_key_here
   OPENWEATHER_API_KEY=your_key_here
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

4. Check `/api/health` — services should now show `"configured"`.

5. On the Orbit page, click **"✦ AI Insight"** → the badge will show **"AI · Gemini"** instead of "Mock Fallback".

6. The weather widget will show **"⚡ live"** indicator when OpenWeather is active.

---

*Orbit OS · Phase 4 API Layer · May 2026*
