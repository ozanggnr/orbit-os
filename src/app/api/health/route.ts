/**
 * /api/health — GET
 * Health check endpoint that reports API configuration status.
 *
 * Returns 200 with service availability (configured / missing).
 * Safe to call from the client — never returns actual key values.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function isConfigured(envKey: string): 'configured' | 'missing' {
  const val = process.env[envKey];
  return val && val.trim().length > 0 ? 'configured' : 'missing';
}

export async function GET() {
  const cookieStore = await cookies();
  const gcalConnected    = cookieStore.has('gcal_access_token');
  const spotifyConnected = cookieStore.has('spotify_access_token');

  return NextResponse.json({
    status: 'ok',
    app:    process.env.NEXT_PUBLIC_APP_NAME ?? 'Orbit OS',
    version: '0.4.0',
    timestamp: new Date().toISOString(),
    services: {
      gemini:          isConfigured('GEMINI_API_KEY'),
      openweather:     isConfigured('OPENWEATHER_API_KEY'),
      googleCalendar: {
        credentials:   isConfigured('GOOGLE_CALENDAR_CLIENT_ID'),
        authenticated: gcalConnected,
      },
      spotify: {
        credentials:   isConfigured('SPOTIFY_CLIENT_ID'),
        authenticated: spotifyConnected,
      },
    },
    fallback: {
      enabled: true,
      note: 'All services fall back to mock data when not configured.',
    },
  });
}
