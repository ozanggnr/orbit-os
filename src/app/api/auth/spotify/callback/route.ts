/**
 * /api/auth/spotify/callback — GET
 * Handles Spotify OAuth callback after user grants music access.
 *
 * SECURITY:
 *   - CSRF state validated against stored cookie
 *   - Access token stored in httpOnly cookie (short-lived)
 *   - Client secret never leaves the server
 *   - TODO (Phase 5): Encrypt tokens and store in database
 *   - TODO (Phase 5): Implement refresh token rotation
 */
import { NextRequest, NextResponse } from 'next/server';
import { exchangeSpotifyCode } from '@/lib/server/spotify';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(`${appUrl}/settings?spotify=denied`);
  }

  // Validate CSRF state
  const cookieStore = await cookies();
  const storedState = cookieStore.get('spotify_oauth_state')?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}/settings?spotify=state_mismatch`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/settings?spotify=error`);
  }

  const tokens = await exchangeSpotifyCode(code);

  if (!tokens) {
    return NextResponse.redirect(`${appUrl}/settings?spotify=token_error`);
  }

  const res = NextResponse.redirect(`${appUrl}/settings?spotify=connected`);

  // Store access token in httpOnly cookie
  // TODO (Phase 5): Encrypt and store in database keyed by user ID
  res.cookies.set('spotify_access_token', tokens.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   tokens.expires_in ?? 3600,
    path:     '/',
  });

  // Clean up state cookie
  res.cookies.delete('spotify_oauth_state');

  // TODO (Phase 5): Store refresh_token (encrypted) in database for renewal

  return res;
}
