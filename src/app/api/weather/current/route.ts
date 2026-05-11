/**
 * /api/weather/current — GET
 * Returns current weather data from OpenWeather API (or mock fallback).
 *
 * Query params:
 *   ?city=Istanbul&country=TR  (optional — defaults from env)
 *   ?lat=41.01&lon=28.95       (optional — lat/lon override)
 *
 * SECURITY: OPENWEATHER_API_KEY stays server-side only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentWeather } from '@/lib/server/weather';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params: { city?: string; country?: string; lat?: number; lon?: number } = {};

    if (searchParams.has('city'))    params.city    = searchParams.get('city')!;
    if (searchParams.has('country')) params.country = searchParams.get('country')!;
    if (searchParams.has('lat'))     params.lat     = parseFloat(searchParams.get('lat')!);
    if (searchParams.has('lon'))     params.lon     = parseFloat(searchParams.get('lon')!);

    const weather = await getCurrentWeather(params);
    return NextResponse.json(weather);
  } catch (err) {
    console.error('[/api/weather/current]', err);
    return NextResponse.json(
      { error: 'Failed to fetch weather', source: 'error' },
      { status: 500 }
    );
  }
}
