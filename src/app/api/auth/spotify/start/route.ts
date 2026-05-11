/**
 * /api/auth/spotify/start — GET
 * Redirects the user to Spotify's OAuth authorization page.
 *
 * Scopes: user-read-recently-played, user-top-read, user-read-currently-playing
 */
import { NextResponse } from 'next/server';
import { buildSpotifyAuthUrl, generateOAuthState } from '@/lib/server/spotify';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        error: 'Spotify OAuth credentials not configured.',
        hint: 'Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local',
      },
      { status: 503 }
    );
  }

  const state   = generateOAuthState();
  const authUrl = buildSpotifyAuthUrl(state);

  // Store state in httpOnly cookie for CSRF validation in callback
  const res = NextResponse.redirect(authUrl);
  res.cookies.set('spotify_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   600, // 10 minutes
    path:     '/',
  });

  return res;
}
