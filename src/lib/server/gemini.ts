/**
 * lib/server/gemini.ts
 * ─────────────────────────────────────────────────────────────────
 * Server-side Gemini AI service for Orbit OS.
 *
 * SECURITY: This module runs on the server only (Node.js runtime).
 * GEMINI_API_KEY is read from process.env — never sent to the client.
 *
 * Usage: import only from Next.js Route Handlers (/api/ai/*)
 * Never import this file from client components ('use client').
 * ─────────────────────────────────────────────────────────────────
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/* ── Types ──────────────────────────────────────────────────────── */
export interface InsightRequest {
  mood: string;
  energy: number;
  events: Array<{ title: string; type: string; startTime: string; completed: boolean }>;
  weather: { condition?: string; temperature?: number; city?: string };
  focusSessions: number;
  streak: number;
  focusHoursToday: number;
  musicPlaying?: boolean;
  hour?: number;
}

export interface InsightResponse {
  summary: string;
  recommendations: string[];
  risk: string;
  confidence: number;
  source: 'gemini' | 'mock-fallback';
  model?: string;
}

/* ── Mock fallback data ─────────────────────────────────────────── */
const MOCK_INSIGHTS: InsightResponse[] = [
  {
    summary: 'Your energy patterns suggest the next 2 hours are your strongest focus window of the day.',
    recommendations: [
      'Schedule your highest-impact task between now and 23:00',
      'Keep ambient instrumental music playing — it correlates with your top sessions',
      'A short 5-minute walk before starting will prime your focus state',
    ],
    risk: 'Calendar density is moderate — guard your focus blocks from interruptions.',
    confidence: 0.82,
    source: 'mock-fallback',
  },
  {
    summary: 'Your meditation streak and music choice are creating optimal conditions for deep work tonight.',
    recommendations: [
      'Move Architecture Planning to the top of your remaining tasks',
      'Set a 25-minute timer and go into full focus mode',
      'Review tomorrow\'s calendar now to prevent morning decision fatigue',
    ],
    risk: 'Low energy risk if you skip your evening routine — protect the streak.',
    confidence: 0.76,
    source: 'mock-fallback',
  },
  {
    summary: 'Partly cloudy conditions and 19°C historically match your best creative output sessions.',
    recommendations: [
      'Use this creative window for architecture or design decisions',
      'Journal any insights before they fade — your retention drops after midnight',
      'Plan tomorrow\'s Deep Work block for 09:00–11:00 based on your peak pattern',
    ],
    risk: 'Medium — late coding sessions tonight may delay sleep and reduce tomorrow\'s morning energy.',
    confidence: 0.71,
    source: 'mock-fallback',
  },
];

function getMockFallback(): InsightResponse {
  return MOCK_INSIGHTS[Math.floor(Math.random() * MOCK_INSIGHTS.length)];
}

/* ── Build a structured prompt for Gemini ───────────────────────── */
function buildPrompt(req: InsightRequest): string {
  const pendingEvents = req.events.filter(e => !e.completed);
  const completedCount = req.events.filter(e => e.completed).length;
  const currentHour = req.hour ?? new Date().getHours();

  return `You are the AI core of Orbit OS, a personal productivity operating system.

Generate a personalized daily insight for the user based on their current data.

USER CONTEXT:
- Current mood: ${req.mood}
- Energy level: ${req.energy}%
- Time of day: ${currentHour}:00
- Focus hours completed today: ${req.focusHoursToday}h
- Focus sessions today: ${req.focusSessions}
- Current habit streak: ${req.streak} days
- Music playing: ${req.musicPlaying ? 'Yes (ambient/instrumental)' : 'No'}

SCHEDULE:
- Tasks completed: ${completedCount}/${req.events.length}
- Pending tasks: ${pendingEvents.map(e => `"${e.title}" (${e.type})`).join(', ') || 'None remaining'}

WEATHER:
- Condition: ${req.weather.condition ?? 'Unknown'}
- Temperature: ${req.weather.temperature ?? 'Unknown'}°C
- Location: ${req.weather.city ?? 'Unknown'}

Respond with ONLY a valid JSON object in this exact format:
{
  "summary": "One sentence capturing the most important insight for this moment.",
  "recommendations": [
    "Specific, actionable recommendation 1",
    "Specific, actionable recommendation 2",
    "Specific, actionable recommendation 3"
  ],
  "risk": "One sentence about the main risk or thing to watch for.",
  "confidence": 0.85
}

Rules:
- Be specific and personal — reference their actual data
- Recommendations must be immediately actionable
- Confidence is 0.0–1.0 based on data quality
- Keep each text concise (under 120 characters)
- Respond ONLY with the JSON, no extra text`;
}

/* ── Main export ─────────────────────────────────────────────────── */
export async function generateDailyInsight(req: InsightRequest): Promise<InsightResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model  = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';

  // Return mock fallback if key not configured
  if (!apiKey) {
    console.info('[Gemini] No API key configured — returning mock fallback');
    return getMockFallback();
  }

  try {
    const genAI    = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model });

    const prompt = buildPrompt(req);
    const result = await genModel.generateContent(prompt);
    const text   = result.response.text().trim();

    // Strip markdown code blocks if Gemini wraps the JSON
    const clean = text.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(clean) as Omit<InsightResponse, 'source' | 'model'>;

    return {
      summary: parsed.summary ?? 'Insight generated.',
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 3) : [],
      risk: parsed.risk ?? '',
      confidence: typeof parsed.confidence === 'number' ? Math.min(1, Math.max(0, parsed.confidence)) : 0.75,
      source: 'gemini',
      model,
    };
  } catch (err) {
    console.error('[Gemini] Error generating insight:', err);
    return getMockFallback();
  }
}
