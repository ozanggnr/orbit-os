/**
 * /api/calendar/events — GET
 * Returns today's calendar events from Google Calendar (or mock fallback).
 *
 * Requires user to have completed Google OAuth flow first.
 * If not authenticated, returns mock events with source: 'mock-fallback'.
 *
 * SECURITY: Google tokens stored in httpOnly cookies.
 */
import { NextResponse } from 'next/server';
import { getTodaysEvents } from '@/lib/server/googleCalendar';

export async function GET() {
  try {
    const events = await getTodaysEvents();
    return NextResponse.json({ events, count: events.length });
  } catch (err) {
    console.error('[/api/calendar/events]', err);
    return NextResponse.json(
      { error: 'Failed to fetch events', events: [], count: 0 },
      { status: 500 }
    );
  }
}
