/**
 * lib/server/googleCalendar.ts
 * ─────────────────────────────────────────────────────────────────
 * Server-side Google Calendar OAuth service for Orbit OS.
 *
 * SECURITY:
 *   - GOOGLE_CALENDAR_CLIENT_SECRET stays server-side only
 *   - Access tokens stored in httpOnly cookies (short-lived)
 *   - TODO (Phase 5): Encrypt tokens and store in database
 *
 * Usage: import only from Next.js Route Handlers
 * ─────────────────────────────────────────────────────────────────
 */

import { cookies } from 'next/headers';

/* ── Types ──────────────────────────────────────────────────────── */
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'calendar';
  colorHex?: string;
  location?: string;
  description?: string;
  source: 'google-calendar' | 'mock-fallback';
}

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/* ── OAuth config ───────────────────────────────────────────────── */
export function getOAuthConfig() {
  return {
    clientId:     process.env.GOOGLE_CALENDAR_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET ?? '',
    redirectUri:  process.env.GOOGLE_CALENDAR_REDIRECT_URI ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  };
}

/* ── Generate OAuth URL ─────────────────────────────────────────── */
export function buildAuthUrl(): string {
  const cfg = getOAuthConfig();
  const params = new URLSearchParams({
    client_id:     cfg.clientId,
    redirect_uri:  cfg.redirectUri,
    response_type: 'code',
    scope:         cfg.scopes.join(' '),
    access_type:   'offline',
    prompt:        'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/* ── Exchange auth code for tokens ─────────────────────────────── */
export async function exchangeCode(code: string): Promise<OAuthTokens | null> {
  const cfg = getOAuthConfig();
  if (!cfg.clientId || !cfg.clientSecret) return null;

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     cfg.clientId,
        client_secret: cfg.clientSecret,
        redirect_uri:  cfg.redirectUri,
        grant_type:    'authorization_code',
      }),
    });
    if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
    return res.json() as Promise<OAuthTokens>;
  } catch (err) {
    console.error('[GoogleCalendar] Token exchange error:', err);
    return null;
  }
}

/* ── Get stored access token from httpOnly cookie ──────────────── */
export async function getStoredToken(): Promise<string | null> {
  // TODO (Phase 5): Replace cookie storage with encrypted database token storage
  // Reference: https://next-auth.js.org/ for production token management
  try {
    const cookieStore = await cookies();
    return cookieStore.get('gcal_access_token')?.value ?? null;
  } catch {
    return null;
  }
}

/* ── Fetch today's calendar events ─────────────────────────────── */
export async function getTodaysEvents(): Promise<CalendarEvent[]> {
  const token = await getStoredToken();

  if (!token) {
    console.info('[GoogleCalendar] No token — returning mock fallback');
    return getMockCalendarEvents();
  }

  try {
    const now    = new Date();
    const start  = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const end    = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      new URLSearchParams({
        timeMin:      start,
        timeMax:      end,
        singleEvents: 'true',
        orderBy:      'startTime',
        maxResults:   '20',
      });

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Calendar API ${res.status}`);

    const data = await res.json() as {
      items: Array<{
        id: string;
        summary?: string;
        start: { dateTime?: string; date?: string };
        end:   { dateTime?: string; date?: string };
        colorId?: string;
        location?: string;
        description?: string;
      }>;
    };

    return data.items.map(item => ({
      id:          item.id,
      title:       item.summary ?? '(No title)',
      start:       item.start.dateTime ?? item.start.date ?? '',
      end:         item.end.dateTime   ?? item.end.date   ?? '',
      type:        'calendar' as const,
      location:    item.location,
      description: item.description,
      source:      'google-calendar' as const,
    }));
  } catch (err) {
    console.error('[GoogleCalendar] Error fetching events:', err);
    return getMockCalendarEvents();
  }
}

/* ── Mock fallback events ───────────────────────────────────────── */
function getMockCalendarEvents(): CalendarEvent[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { id: 'cal-mock-1', title: 'Deep Work Block',         start: `${today}T09:00:00`, end: `${today}T11:00:00`, type: 'calendar', source: 'mock-fallback' },
    { id: 'cal-mock-2', title: 'Team Sync',               start: `${today}T11:30:00`, end: `${today}T12:00:00`, type: 'calendar', source: 'mock-fallback' },
    { id: 'cal-mock-3', title: 'Architecture Planning',   start: `${today}T15:30:00`, end: `${today}T17:30:00`, type: 'calendar', source: 'mock-fallback' },
  ];
}
