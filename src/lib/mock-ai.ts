/**
 * mock-ai.ts
 * ──────────────────────────────────────────────────────────────
 * Mock AI Insight Service for Orbit OS — Phase 3.
 *
 * Simulates Gemini AI behaviour with realistic delays and
 * context-aware insight generation based on mock data.
 *
 * FUTURE: Replace `generateInsight` with a real fetch() call
 * to /api/ai/insight, which will call the Gemini API server-side
 * using GEMINI_API_KEY from .env (never exposed to the client).
 * ──────────────────────────────────────────────────────────────
 */

import { MoodType } from '@/types';

export type InsightContext = {
  mood:         MoodType;
  energyLevel:  number;
  tasksCompleted: number;
  totalTasks:   number;
  focusHours:   number;
  streak:       number;
  musicPlaying: boolean;
  weather:      string;
  hour:         number; // 0–23
};

export type MockInsight = {
  id: string;
  text: string;
  type: 'energy' | 'focus' | 'habit' | 'weather' | 'pattern' | 'motivation';
  confidence: number;
  actionLabel?: string;
};

/* ── Insight templates ──────────────────────────────────────────────────── */

const ENERGY_INSIGHTS = [
  (ctx: InsightContext) => `Your energy is at ${ctx.energyLevel}% — ${ctx.energyLevel > 70 ? 'well above' : 'slightly below'} your weekly average of 71%. ${ctx.energyLevel > 70 ? 'Now is an ideal time for high-focus tasks.' : 'Consider a short break before your next session.'}`,
  () => `Energy readings show your second wind typically arrives around 19:00–21:00 based on the last 14 days. Use it for creative or planning work.`,
];

const FOCUS_INSIGHTS = [
  (ctx: InsightContext) => `You have completed ${ctx.focusHours}h of focus time today. ${ctx.focusHours > 4 ? 'Exceptional output — you are in your top 15% of focus days.' : 'You are on track. One more 90-minute session puts you above your weekly average.'}`,
  (ctx: InsightContext) => `Your task completion rate today is ${Math.round((ctx.tasksCompleted / ctx.totalTasks) * 100)}%. ${ctx.tasksCompleted >= ctx.totalTasks ? 'All done — a perfect day.' : `${ctx.totalTasks - ctx.tasksCompleted} remaining — the afternoon window looks clear.`}`,
  () => `Flow state analysis: you typically enter deep flow after 11–14 minutes of sustained attention. Consider using a 2-minute breathing exercise before your next focus block.`,
];

const HABIT_INSIGHTS = [
  (ctx: InsightContext) => `Your ${ctx.streak}-day streak is your longest active habit chain. Protecting it tonight has compounding value — breaking streaks over 7 days costs an average of 4 days to rebuild.`,
  () => `Morning meditation before 09:00 correlates with a 23-point boost in your afternoon energy readings. Your 8-day streak is already showing this pattern.`,
  () => `Your reading habit (21-day streak) is your most consistent behaviour. Data shows it correlates with higher creative output and better problem-solving the following morning.`,
];

const WEATHER_INSIGHTS = [
  (ctx: InsightContext) => `${ctx.weather} conditions tonight historically match your best creative sessions. Your top 5 creative outputs all occurred on similar evenings.`,
  () => `Istanbul's temperature is in your optimal cognitive performance range (15–20°C). External conditions are aligned for a strong evening session.`,
];

const MUSIC_INSIGHTS = [
  () => `Ambient instrumental music is active — this is your highest-correlation focus trigger. Sessions with this audio profile average 47 minutes of sustained flow.`,
  () => `Hans Zimmer tracks specifically appear in 8 of your top 10 focus sessions by task completion. The Interstellar OST is a documented personal performance enhancer.`,
];

const MOTIVATION_INSIGHTS = [
  (ctx: InsightContext) => `You have had ${ctx.focusHours > 3 ? 'three' : 'two'} strong coding days this week. The architecture you are building today will compress next week's implementation by an estimated 40%.`,
  () => `Pattern detected: when you complete your evening routine (run + no-screen wind-down), next-morning energy averages 79%. Tonight's conditions are ideal to close the loop.`,
  () => `Your best focus window today is between 19:00 and 21:00 based on circadian data and your historical session logs. Schedule your highest-value task for this window.`,
];

const ALL_INSIGHTS: ((ctx: InsightContext) => string)[][] = [
  ENERGY_INSIGHTS, FOCUS_INSIGHTS, HABIT_INSIGHTS, WEATHER_INSIGHTS, MUSIC_INSIGHTS, MOTIVATION_INSIGHTS,
];
const TYPES: MockInsight['type'][] = ['energy', 'focus', 'habit', 'weather', 'pattern', 'motivation'];

/* ── Utility ─────────────────────────────────────────────────────────────── */
function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function uid() { return `insight-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

/* ── Simulate typing / streaming delay ──────────────────────────────────── */
function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * Generate a single mock AI insight based on current context.
 * Simulates a 1.2–2.4s "AI thinking" delay.
 *
 * FUTURE: Replace with:
 *   const res = await fetch('/api/ai/insight', { method: 'POST', body: JSON.stringify(ctx) });
 *   return res.json();
 */
export async function generateInsight(ctx: InsightContext): Promise<MockInsight> {
  const thinkTime = 1200 + Math.random() * 1200;
  await delay(thinkTime);

  const typeIdx    = Math.floor(Math.random() * ALL_INSIGHTS.length);
  const pool       = ALL_INSIGHTS[typeIdx];
  const generator  = pickRandom(pool);
  const type       = TYPES[typeIdx];

  const ACTION_LABELS: Partial<Record<MockInsight['type'], string>> = {
    focus:      'Start Focus Session',
    habit:      'Mark Habit Done',
    energy:     'View Energy Chart',
    weather:    'Check Forecast',
    motivation: 'Open Timeline',
  };

  return {
    id:          uid(),
    text:        generator(ctx),
    type,
    confidence:  60 + Math.floor(Math.random() * 38),
    actionLabel: ACTION_LABELS[type],
  };
}

/**
 * Generate a batch of 3 contextual insights for the daily brief.
 * Simulates a 2–3s generation delay total.
 */
export async function generateDailyBatch(ctx: InsightContext): Promise<MockInsight[]> {
  const thinkTime = 2000 + Math.random() * 1000;
  await delay(thinkTime);

  const usedTypes = new Set<string>();
  const results: MockInsight[] = [];

  for (let i = 0; i < 3; i++) {
    let typeIdx: number;
    let attempts = 0;
    do {
      typeIdx = Math.floor(Math.random() * ALL_INSIGHTS.length);
      attempts++;
    } while (usedTypes.has(TYPES[typeIdx]) && attempts < 10);

    usedTypes.add(TYPES[typeIdx]);
    const generator = pickRandom(ALL_INSIGHTS[typeIdx]);

    results.push({
      id:          uid(),
      text:        generator(ctx),
      type:        TYPES[typeIdx],
      confidence:  60 + Math.floor(Math.random() * 38),
    });
  }

  return results;
}

/**
 * Generate a short daily recap narrative.
 * FUTURE: Replace with Gemini streaming API call.
 */
export async function generateDailyRecap(ctx: InsightContext): Promise<string> {
  await delay(1800 + Math.random() * 800);

  const completion = Math.round((ctx.tasksCompleted / ctx.totalTasks) * 100);
  const moodEmoji: Record<MoodType, string> = {
    focused: '🎯', energized: '⚡', calm: '🌊', creative: '✨', tired: '😴', stressed: '🌀',
  };

  return `${moodEmoji[ctx.mood]} Good ${ctx.hour < 12 ? 'morning' : ctx.hour < 18 ? 'afternoon' : 'evening'}. You have completed ${completion}% of today's plan with ${ctx.focusHours}h of focused work. Energy is at ${ctx.energyLevel}% — ${ctx.energyLevel > 70 ? 'above your weekly average' : 'slightly below baseline'}. Your ${ctx.streak}-day habit streak is your current longest chain. ${ctx.musicPlaying ? 'Ambient music is active and supporting your flow state.' : ''} The next 2 hours represent your strongest predicted performance window of the evening.`;
}
