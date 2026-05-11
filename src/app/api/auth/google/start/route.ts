/**
 * /api/auth/google/start — GET
 * Redirects the user to Google's OAuth 2.0 authorization page.
 *
 * Scopes requested: calendar.readonly, userinfo.email
 */
import { NextResponse } from 'next/server';
import { buildAuthUrl, getOAuthConfig } from '@/lib/server/googleCalendar';

export async function GET() {
  const { clientId, clientSecret } = getOAuthConfig();

  // Validate credentials are configured
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        error: 'Google Calendar OAuth credentials not configured.',
        hint: 'Set GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET in .env.local',
      },
      { status: 503 }
    );
  }

  const authUrl = buildAuthUrl();
  return NextResponse.redirect(authUrl);
}
