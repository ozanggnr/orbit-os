/**
 * lib/client/api.ts
 * ─────────────────────────────────────────────────────────────────
 * Client-side API utilities for Orbit OS.
 *
 * These functions call INTERNAL Next.js API routes only.
 * They NEVER call external APIs directly — all secrets stay server-side.
 *
 * Usage: import from client components ('use client')
 * ─────────────────────────────────────────────────────────────────
 */

import type { InsightRequest } from '@/lib/server/gemini';

/* ── Base URL ────────────────────────────────────────────────────── */
const BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');

/* ── Types (client-facing) ──────────────────────────────────────── */
export interface DailyInsightResult {
  summary: string;
  recommendations: string[];
  risk: string;
  confidence: number;
  source: 'gemini' | 'mock-fallback' | 'error';
  model?: string;
}

export interface WeatherResult {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  emoji: string;
  source: 'openweather' | 'mock-fallback' | 'error';
}

export interface CalendarEventsResult {
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    type: string;
    source: string;
  }>;
  count: number;
  source?: string;
}

export interface RecentlyPlayedResult {
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    album: string;
    playedAt: string;
    durationMs: number;
    moodTag: string;
    source: string;
  }>;
  count: number;
}

export interface HealthResult {
  status: string;
  app: string;
  version: string;
  timestamp: string;
  services: {
    gemini: string;
    openweather: string;
    googleCalendar: { credentials: string; authenticated: boolean };
    spotify: { credentials: string; authenticated: boolean };
  };
  fallback: { enabled: boolean; note: string };
}

/* ── getDailyInsight ────────────────────────────────────────────── */
export async function getDailyInsight(
  payload: Partial<InsightRequest>
): Promise<DailyInsightResult> {
  try {
    const res = await fetch(`${BASE}/api/ai/daily-insight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<DailyInsightResult>;
  } catch (err) {
    console.error('[api.getDailyInsight]', err);
    return {
      summary: 'Unable to generate insight right now. Your mock data is still available.',
      recommendations: [],
      risk: '',
      confidence: 0,
      source: 'error',
    };
  }
}

/* ── getCurrentWeather ──────────────────────────────────────────── */
export async function getCurrentWeather(params: {
  city?: string;
  country?: string;
  lat?: number;
  lon?: number;
} = {}): Promise<WeatherResult> {
  try {
    const query = new URLSearchParams();
    if (params.city)    query.set('city',    params.city);
    if (params.country) query.set('country', params.country);
    if (params.lat)     query.set('lat',     String(params.lat));
    if (params.lon)     query.set('lon',     String(params.lon));

    const res = await fetch(`${BASE}/api/weather/current?${query.toString()}`, {
      next: { revalidate: 600 },
    } as RequestInit);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<WeatherResult>;
  } catch (err) {
    console.error('[api.getCurrentWeather]', err);
    // Return a safe mock on error
    return {
      location: params.city ?? 'Ankara',
      temperature: 19, feelsLike: 17,
      condition: 'Clouds', description: 'partly cloudy',
      humidity: 62, windSpeed: 3.2,
      icon: '02n', emoji: '⛅',
      source: 'error',
    };
  }
}

/* ── getCalendarEvents ──────────────────────────────────────────── */
export async function getCalendarEvents(): Promise<CalendarEventsResult> {
  try {
    const res = await fetch(`${BASE}/api/calendar/events`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<CalendarEventsResult>;
  } catch (err) {
    console.error('[api.getCalendarEvents]', err);
    return { events: [], count: 0 };
  }
}

/* ── getRecentlyPlayed ──────────────────────────────────────────── */
export async function getRecentlyPlayed(limit = 10): Promise<RecentlyPlayedResult> {
  try {
    const res = await fetch(`${BASE}/api/spotify/recently-played?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<RecentlyPlayedResult>;
  } catch (err) {
    console.error('[api.getRecentlyPlayed]', err);
    return { tracks: [], count: 0 };
  }
}

/* ── getHealth ──────────────────────────────────────────────────── */
export async function getHealth(): Promise<HealthResult | null> {
  try {
    const res = await fetch(`${BASE}/api/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<HealthResult>;
  } catch (err) {
    console.error('[api.getHealth]', err);
    return null;
  }
}
