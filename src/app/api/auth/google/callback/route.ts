/**
 * /api/auth/google/callback — GET
 * Handles Google OAuth 2.0 callback after user grants calendar access.
 *
 * SECURITY:
 *   - Access token stored in httpOnly, SameSite=Lax cookie (short-lived)
 *   - TODO (Phase 5): Store encrypted tokens in database keyed by user ID
 *   - TODO (Phase 5): Implement refresh token rotation
 *   - TODO (Phase 5): Use NextAuth.js for production token management
 */
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCode } from '@/lib/server/googleCalendar';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error');

  // User denied access
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?gcal=denied`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?gcal=error`
    );
  }

  const tokens = await exchangeCode(code);

  if (!tokens) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?gcal=token_error`
    );
  }

  // Store access token in httpOnly cookie
  // TODO (Phase 5): Encrypt and store in database instead
  const res = NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/settings?gcal=connected`
  );

  res.cookies.set('gcal_access_token', tokens.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   tokens.expires_in ?? 3600,
    path:     '/',
  });

  // TODO (Phase 5): Also store refresh_token (encrypted) in database for token renewal

  return res;
}
