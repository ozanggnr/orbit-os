/**
 * lib/server/spotify.ts
 * ─────────────────────────────────────────────────────────────────
 * Server-side Spotify OAuth service for Orbit OS.
 *
 * SECURITY:
 *   - SPOTIFY_CLIENT_SECRET stays server-side only
 *   - Access tokens stored in httpOnly cookies (short-lived)
 *   - SPOTIFY_CLIENT_ID is public (used in PKCE flows)
 *   - TODO (Phase 5): Encrypt tokens and store in database
 *
 * Usage: import only from Next.js Route Handlers
 * ─────────────────────────────────────────────────────────────────
 */

import { cookies } from 'next/headers';
import crypto from 'crypto';

/* ── Types ──────────────────────────────────────────────────────── */
export interface RecentTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  playedAt: string;
  durationMs: number;
  moodTag: 'focus' | 'relax' | 'energize' | 'ambient' | 'other';
  source: 'spotify' | 'mock-fallback';
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/* ── Scopes ─────────────────────────────────────────────────────── */
const SPOTIFY_SCOPES = [
  'user-read-recently-played',
  'user-top-read',
  'user-read-currently-playing',
].join(' ');

/* ── Build authorization URL ────────────────────────────────────── */
export function buildSpotifyAuthUrl(state: string): string {
  const clientId   = process.env.SPOTIFY_CLIENT_ID ?? '';
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI ??
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/spotify/callback`;

  const params = new URLSearchParams({
    client_id:     clientId,
    response_type: 'code',
    redirect_uri:  redirectUri,
    state,
    scope:         SPOTIFY_SCOPES,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/* ── Generate random state for CSRF protection ──────────────────── */
export function generateOAuthState(): string {
  return crypto.randomBytes(16).toString('hex');
}

/* ── Exchange code for tokens ───────────────────────────────────── */
export async function exchangeSpotifyCode(code: string): Promise<SpotifyTokens | null> {
  const clientId     = process.env.SPOTIFY_CLIENT_ID     ?? '';
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';
  const redirectUri  = process.env.SPOTIFY_REDIRECT_URI  ??
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/spotify/callback`;

  if (!clientId || !clientSecret) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!res.ok) throw new Error(`Spotify token exchange failed: ${res.status}`);
    return res.json() as Promise<SpotifyTokens>;
  } catch (err) {
    console.error('[Spotify] Token exchange error:', err);
    return null;
  }
}

/* ── Get stored token from httpOnly cookie ──────────────────────── */
export async function getSpotifyToken(): Promise<string | null> {
  // TODO (Phase 5): Replace with encrypted database storage + refresh token rotation
  try {
    const cookieStore = await cookies();
    return cookieStore.get('spotify_access_token')?.value ?? null;
  } catch {
    return null;
  }
}

/* ── Infer mood tag from track audio features (simplified) ─────── */
function inferMoodTag(trackName: string, artistName: string): RecentTrack['moodTag'] {
  const combined = `${trackName} ${artistName}`.toLowerCase();
  if (/zimmer|arnalds|einaudi|glass|ambient|lofi|focus|study|deep/i.test(combined)) return 'focus';
  if (/chill|relax|peace|calm|sleep|rain|nature/i.test(combined))                   return 'relax';
  if (/workout|pump|energy|run|power|fire|hype/i.test(combined))                   return 'energize';
  if (/jazz|classical|piano|acoustic|slow/i.test(combined))                        return 'ambient';
  return 'other';
}

/* ── Fetch recently played tracks ───────────────────────────────── */
export async function getRecentlyPlayed(limit = 10): Promise<RecentTrack[]> {
  const token = await getSpotifyToken();

  if (!token) {
    console.info('[Spotify] No token — returning mock fallback');
    return getMockTracks();
  }

  try {
    const url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 120 },
    });

    if (!res.ok) throw new Error(`Spotify API ${res.status}`);

    const data = await res.json() as {
      items: Array<{
        track: {
          id: string;
          name: string;
          duration_ms: number;
          album: { name: string };
          artists: Array<{ name: string }>;
        };
        played_at: string;
      }>;
    };

    return data.items.map(item => ({
      id:          item.track.id,
      title:       item.track.name,
      artist:      item.track.artists[0]?.name ?? 'Unknown',
      album:       item.track.album.name,
      playedAt:    item.played_at,
      durationMs:  item.track.duration_ms,
      moodTag:     inferMoodTag(item.track.name, item.track.artists[0]?.name ?? ''),
      source:      'spotify' as const,
    }));
  } catch (err) {
    console.error('[Spotify] Error fetching recently played:', err);
    return getMockTracks();
  }
}

/* ── Mock fallback tracks ───────────────────────────────────────── */
function getMockTracks(): RecentTrack[] {
  const now = new Date();
  return [
    {
      id: 'mock-1', title: 'Cornfield Chase', artist: 'Hans Zimmer', album: 'Interstellar OST',
      playedAt: new Date(now.getTime() - 10 * 60000).toISOString(),
      durationMs: 192000, moodTag: 'focus', source: 'mock-fallback',
    },
    {
      id: 'mock-2', title: 'Experience', artist: 'Ludovico Einaudi', album: 'In a Time Lapse',
      playedAt: new Date(now.getTime() - 25 * 60000).toISOString(),
      durationMs: 348000, moodTag: 'focus', source: 'mock-fallback',
    },
    {
      id: 'mock-3', title: 'Near Light', artist: 'Ólafur Arnalds', album: 'Living Room Songs',
      playedAt: new Date(now.getTime() - 50 * 60000).toISOString(),
      durationMs: 261000, moodTag: 'ambient', source: 'mock-fallback',
    },
  ];
}
