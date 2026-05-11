/**
 * /api/spotify/recently-played — GET
 * Returns recently played Spotify tracks (or mock fallback).
 *
 * Query params: ?limit=10 (optional, default 10)
 *
 * SECURITY: Spotify access token read from httpOnly cookie server-side.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getRecentlyPlayed } from '@/lib/server/spotify';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '10', 10));

    const tracks = await getRecentlyPlayed(limit);
    return NextResponse.json({ tracks, count: tracks.length });
  } catch (err) {
    console.error('[/api/spotify/recently-played]', err);
    return NextResponse.json(
      { error: 'Failed to fetch recently played', tracks: [], count: 0 },
      { status: 500 }
    );
  }
}
