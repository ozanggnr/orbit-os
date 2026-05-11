/**
 * /api/ai/daily-insight — POST
 * Generates a personalized daily insight via Gemini AI (or mock fallback).
 *
 * SECURITY: GEMINI_API_KEY is only accessed in lib/server/gemini.ts
 * This route handler NEVER returns the key to the client.
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateDailyInsight, InsightRequest } from '@/lib/server/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<InsightRequest>;

    // Validate / supply defaults for required fields
    const payload: InsightRequest = {
      mood:             body.mood             ?? 'focused',
      energy:           body.energy           ?? 70,
      events:           body.events           ?? [],
      weather:          body.weather          ?? {},
      focusSessions:    body.focusSessions    ?? 0,
      streak:           body.streak           ?? 0,
      focusHoursToday:  body.focusHoursToday  ?? 0,
      musicPlaying:     body.musicPlaying     ?? false,
      hour:             body.hour             ?? new Date().getHours(),
    };

    const insight = await generateDailyInsight(payload);
    return NextResponse.json(insight);
  } catch (err) {
    console.error('[/api/ai/daily-insight]', err);
    return NextResponse.json(
      { error: 'Failed to generate insight', source: 'error' },
      { status: 500 }
    );
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
}
