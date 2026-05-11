'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import OrbitCanvas from '@/components/orbit/OrbitCanvas';
import WeatherBeacon from '@/components/dashboard/WeatherBeacon';
import MusicPlayer from '@/components/dashboard/MusicPlayer';
import FocusTimer from '@/components/dashboard/FocusTimer';
import { MetricPill, GlassPanel, ProgressBar, Divider, LiveDot, AIBadge, staggerContainer, fadeUp, scaleIn } from '@/components/ui/primitives';
import { mockUser, mockWeather, mockMusic, mockFocusSession } from '@/lib/mockData';
import { eventsData } from '@/data/mockEvents';
import { metricsData, moodOptions } from '@/data/mockUser';
import { OrbitEvent, MoodType } from '@/types';
import { MOOD_COLORS } from '@/lib/constants';
import { getDailyInsight, getCurrentWeather, WeatherResult, DailyInsightResult } from '@/lib/client/api';
import type { InsightRequest } from '@/lib/server/gemini';

/* ── Quick action definitions ─────────────────────────────────── */
const QUICK_ACTIONS = [
  { id: 'focus',    label: 'Start Focus',    icon: '🎯', color: '#a78bfa', description: 'Begin a 25-min Pomodoro' },
  { id: 'insight',  label: 'AI Insight',     icon: '✦',  color: '#22d3ee', description: 'Generate new insight' },
  { id: 'reflect',  label: 'Add Reflection', icon: '✏️', color: '#f472b6', description: 'Log a quick note' },
  { id: 'timeline', label: 'Day Recap',      icon: '📋', color: '#fbbf24', description: 'View your timeline' },
];

/* ── Expandable event card ────────────────────────────────────── */
function EventCard({ evt, selected, onSelect, onToggle }: {
  evt: OrbitEvent; selected: boolean; onSelect: () => void; onToggle: () => void;
}) {
  const dur = (() => {
    const s = new Date(evt.startTime), e = new Date(evt.endTime);
    const m = Math.round((e.getTime() - s.getTime()) / 60000);
    return m >= 60 ? `${m / 60}h` : `${m}m`;
  })();

  return (
    <motion.div
      layout
      className="shrink-0 cursor-pointer"
      style={{ minWidth: selected ? 280 : 158 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
    >
      <motion.div
        className="glass-panel h-full"
        animate={{
          borderColor: selected ? `${evt.color}66` : 'rgba(255,255,255,0.07)',
          boxShadow: selected ? `0 0 20px ${evt.color}33, 0 4px 20px rgba(0,0,0,0.45)` : '0 4px 20px rgba(0,0,0,0.45)',
        }}
        style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}
      >
        {/* Top accent */}
        <div style={{ height: 2, background: evt.completed ? 'rgba(255,255,255,0.12)' : evt.color, boxShadow: evt.completed ? 'none' : `0 0 8px ${evt.color}` }} />

        <div className="p-3">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full shrink-0"
              style={{ background: evt.color, opacity: evt.completed ? 0.4 : 1, boxShadow: evt.completed ? 'none' : `0 0 5px ${evt.color}` }}
            />
            <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 600,
              color: evt.completed ? 'var(--text-400)' : 'var(--text-100)',
              textDecoration: evt.completed ? 'line-through' : 'none',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
            }}>
              {evt.title}
            </p>
          </div>

          <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginBottom: selected ? 10 : 0 }}>
            {evt.startTime.slice(11,16)} · {dur} · {evt.type}
          </p>

          {/* Expanded detail */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
              >
                <Divider className="my-2" />
                <div className="flex gap-2 flex-wrap mb-3">
                  <MetricPill color={evt.color}>{evt.type}</MetricPill>
                  <MetricPill color={evt.urgency === 'high' ? '#f59e0b' : evt.urgency === 'medium' ? '#22d3ee' : '#34d399'}>
                    {evt.urgency} priority
                  </MetricPill>
                  {evt.completed && <MetricPill color="#34d399">✓ Done</MetricPill>}
                </div>
                <ProgressBar value={evt.completed ? 100 : 0} color={evt.color} height={2} />
                <motion.button
                  className="w-full mt-3 rounded-xl py-2 text-xs font-medium"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: evt.completed ? 'rgba(255,255,255,0.04)' : `${evt.color}22`,
                    border: `1px solid ${evt.color}44`,
                    color: evt.completed ? 'var(--text-400)' : evt.color,
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                >
                  {evt.completed ? '↩ Mark Incomplete' : '✓ Mark Complete'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── AI Insight Panel — calls /api/ai/daily-insight ──────────────── */
function AIInsightPanel({ payload }: { payload: Partial<InsightRequest> }) {
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [insight, setInsight] = useState<DailyInsightResult | null>(null);

  const generate = useCallback(async () => {
    setStatus('loading');
    setInsight(null);
    const result = await getDailyInsight(payload);
    setInsight(result);
    setStatus(result.source === 'error' ? 'error' : 'done');
  }, [payload]);

  const isMock = insight?.source === 'mock-fallback';
  const isGemini = insight?.source === 'gemini';

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <AIBadge label={isGemini ? 'AI · Gemini' : isMock ? 'AI · Mock Fallback' : 'AI · Gemini'} />
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.p key="idle" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', lineHeight: 1.65 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Ask Orbit OS for a personal insight based on your current data.
          </motion.p>
        )}

        {status === 'loading' && (
          <motion.div key="loading" className="flex items-center gap-3 py-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa' }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: '#a78bfa', fontFamily: 'var(--font-display)' }}>
              AI is thinking…
            </span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.p key="error" style={{ fontSize: 'var(--text-xs)', color: '#f87171', lineHeight: 1.65 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Could not reach AI service. Check your connection and try again.
          </motion.p>
        )}

        {(status === 'done') && insight && (
          <motion.div key="result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-200)', lineHeight: 1.7, marginBottom: 8 }}>
              {insight.summary}
            </p>
            {insight.recommendations.length > 0 && (
              <ul className="mb-8" style={{ paddingLeft: 0, listStyle: 'none' }}>
                {insight.recommendations.slice(0, 2).map((r, i) => (
                  <li key={i} style={{ fontSize: 10, color: 'var(--text-400)', lineHeight: 1.6,
                    borderLeft: '2px solid rgba(167,139,250,0.4)', paddingLeft: 8, marginBottom: 4 }}>
                    {r}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <MetricPill color={isGemini ? '#34d399' : '#fbbf24'}>
                {isGemini ? '✦ Gemini' : '⚡ Mock'}
              </MetricPill>
              <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-full mt-4 rounded-xl py-2.5 text-xs font-medium"
        style={{
          fontFamily: 'var(--font-display)',
          background: status === 'loading' ? 'rgba(167,139,250,0.08)' : 'rgba(167,139,250,0.14)',
          border: '1px solid rgba(167,139,250,0.3)',
          color: status === 'loading' ? 'var(--text-400)' : '#a78bfa',
          cursor: status === 'loading' ? 'default' : 'pointer',
        }}
        whileHover={status !== 'loading' ? { scale: 1.02 } : undefined}
        whileTap={status !== 'loading' ? { scale: 0.97 } : undefined}
        onClick={status !== 'loading' ? generate : undefined}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? '⟳ Generating…' : status === 'done' ? '↺ New Insight' : '✦ Generate Insight'}
      </motion.button>
    </GlassPanel>
  );
}

/* ── Mood Selector ────────────────────────────────────────────── */
function MoodSelector({ current, onChange }: { current: MoodType; onChange: (m: MoodType) => void }) {
  const [open, setOpen] = useState(false);
  const currentColor = MOOD_COLORS[current];

  return (
    <div className="relative">
      <motion.button
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: `${currentColor.core}22`,
          border: `1px solid ${currentColor.core}44`,
          cursor: 'pointer',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          color: currentColor.core,
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(o => !o)}
      >
        <LiveDot color={currentColor.glow} />
        {currentColor.text}
        <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full mt-2 left-0 z-50"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
          >
            <GlassPanel className="p-2" style={{ minWidth: 180 }}>
              {moodOptions.map(m => (
                <motion.button
                  key={m.value}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left"
                  style={{
                    background: m.value === current ? `${m.color}22` : 'transparent',
                    border: m.value === current ? `1px solid ${m.color}44` : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    color: m.value === current ? m.color : 'var(--text-300)',
                    transition: 'all 0.15s',
                  }}
                  whileHover={{ background: `${m.color}14`, color: m.color }}
                  onClick={() => { onChange(m.value); setOpen(false); }}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                  {m.value === current && <span className="ml-auto" style={{ fontSize: 10 }}>✓</span>}
                </motion.button>
              ))}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Quick Action Buttons ─────────────────────────────────────── */
function QuickActions({ onAction }: { onAction: (id: string) => void }) {
  return (
    <motion.div className="flex gap-2 flex-wrap" variants={staggerContainer} initial="hidden" animate="show">
      {QUICK_ACTIONS.map(a => (
        <motion.button
          key={a.id}
          variants={scaleIn}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
          style={{
            background: `${a.color}14`,
            border: `1px solid ${a.color}30`,
            color: a.color,
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          whileHover={{ scale: 1.05, background: `${a.color}28` }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onAction(a.id)}
          title={a.description}
        >
          <span>{a.icon}</span>
          {a.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

/* ── Toast Notification ───────────────────────────────────────── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  return (
    <motion.div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] glass-panel px-5 py-3"
      style={{ borderRadius: 'var(--radius-xl)', pointerEvents: 'none' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onAnimationComplete={onDone}
      transition={{ duration: 0.3 }}
    >
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-100)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
        {msg}
      </p>
    </motion.div>
  );
}

/* ── Today Summary Panel ──────────────────────────────────────── */
function TodaySummaryPanel({ mood, energyLevel }: { mood: MoodType; energyLevel: number }) {
  const done  = eventsData.filter(e => e.completed).length;
  const total = eventsData.length;

  return (
    <GlassPanel className="p-4">
      <p className="text-label mb-3">TODAY'S SUMMARY</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: 'Tasks',      value: `${done}/${total}`,                     color: '#a78bfa' },
          { label: 'Focus',      value: `${metricsData.focusHoursToday}h`,      color: '#22d3ee' },
          { label: 'Energy',     value: `${energyLevel}%`,                      color: '#34d399' },
          { label: 'Streak',     value: `${metricsData.streakDays}d`,           color: '#fbbf24' },
        ].map(m => (
          <div key={m.label} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: m.color, lineHeight: 1 }}>{m.value}</p>
            <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>{m.label}</p>
          </div>
        ))}
      </div>
      <ProgressBar value={(done / total) * 100} color="#a78bfa" height={3} />
      <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 6, textAlign: 'right' }}>
        {Math.round((done / total) * 100)}% complete
      </p>
    </GlassPanel>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function OrbitPage() {
  const [events, setEvents]           = useState(eventsData);
  const [mood, setMood]               = useState<MoodType>(mockUser.currentMood);
  const [energyLevel, setEnergy]      = useState(mockUser.energyLevel);
  const [selectedEvt, setSelected]    = useState<string | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [toast, setToast]             = useState<string | null>(null);
  // Live weather state — fetched from /api/weather/current, falls back to mock
  const [weather, setWeather]         = useState<WeatherResult>({
    location: 'Ankara', temperature: 19, feelsLike: 17,
    condition: mockWeather.condition, description: 'partly cloudy',
    humidity: mockWeather.humidity, windSpeed: 3.2,
    icon: '02n', emoji: '⛅', source: 'mock-fallback',
  });

  // Fetch live weather on mount
  useEffect(() => {
    getCurrentWeather().then(w => {
      if (w.source !== 'error') setWeather(w);
    }).catch(() => { /* keep mock */ });
  }, []);

  const done  = events.filter(e => e.completed).length;
  const total = events.length;

  const moodColor = MOOD_COLORS[mood];

  const toggleComplete = useCallback((id: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const completed = !e.completed;
      setToast(completed ? `✓ "${e.title}" marked complete` : `↩ "${e.title}" reopened`);
      return { ...e, completed };
    }));
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAction = useCallback((id: string) => {
    if (id === 'insight')  { setShowInsight(s => !s); return; }
    if (id === 'focus')    { setToast('🎯 Focus session starting…'); setTimeout(() => setToast(null), 2800); return; }
    if (id === 'reflect')  { setToast('✏️ Reflection logged to timeline'); setTimeout(() => setToast(null), 2800); return; }
    if (id === 'timeline') { window.location.href = '/timeline'; }
  }, []);

  // Payload for /api/ai/daily-insight
  const insightPayload: Partial<InsightRequest> = {
    mood, energy: energyLevel, focusSessions: metricsData.deepWorkSessions,
    streak: metricsData.streakDays, focusHoursToday: metricsData.focusHoursToday,
    musicPlaying: mockMusic.isPlaying, hour: new Date().getHours(),
    weather: { condition: weather.condition, temperature: weather.temperature, city: weather.location },
    events: events.map(e => ({ title: e.title, type: e.type, startTime: e.startTime, completed: e.completed })),
  };

  const userForCanvas = { ...mockUser, currentMood: mood, energyLevel };

  // Convert WeatherResult to WeatherBeacon-compatible shape
  const weatherForBeacon = {
    condition: weather.condition, temperature: weather.temperature,
    feelsLike: weather.feelsLike, humidity: weather.humidity,
    icon: weather.emoji, city: weather.location, localTime: new Date().toLocaleTimeString(),
  };

  return (
    <AppShell>
      <div className="relative w-full min-h-[calc(100vh-60px)] flex flex-col overflow-hidden">

        {/* ── Header row ── */}
        <motion.div
          className="absolute top-5 left-6 z-30 flex items-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--text-100)', letterSpacing: '-0.02em' }}>
              Orbit
            </h1>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
              {done}/{total} done · May 11
            </p>
          </div>
          <MoodSelector current={mood} onChange={setMood} />
        </motion.div>

        {/* ── Metric pills ── */}
        <motion.div
          className="absolute top-5 right-6 z-30 hidden lg:flex items-center gap-2"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricPill color="#34d399">⚡ {metricsData.focusHoursToday}h focus</MetricPill>
          <MetricPill color="#fbbf24">🔥 {metricsData.streakDays}d streak</MetricPill>
          <MetricPill color="#f472b6">✦ {metricsData.deepWorkSessions} sessions</MetricPill>
        </motion.div>

        {/* ── Orbit scene ── */}
        <div className="flex-1 relative flex items-center justify-center">
          <OrbitCanvas user={userForCanvas} events={events} />

          {/* Weather — live from /api/weather/current, mock fallback. Hidden on xs to save space */}
          <div className="absolute top-20 right-3 sm:right-6 z-30 hidden sm:block">
            <WeatherBeacon data={weatherForBeacon} />
            {weather.source === 'openweather' && (
              <p style={{ fontSize: 9, color: '#34d399', fontFamily: 'var(--font-mono)', textAlign: 'right', marginTop: 3, opacity: 0.7 }}>⚡ live</p>
            )}
          </div>

          {/* Today Summary (desktop, top-left) */}
          <motion.div
            className="absolute top-20 left-6 z-30 hidden lg:block"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TodaySummaryPanel mood={mood} energyLevel={energyLevel} />
          </motion.div>

          {/* Music */}
          <div className="absolute bottom-8 left-6 z-30 hidden sm:block">
            <MusicPlayer track={mockMusic} />
          </div>

          {/* Focus Timer — hidden on mobile to avoid overlap with orbit canvas */}
          <div className="absolute bottom-8 right-6 z-30 hidden sm:block">
            <FocusTimer session={mockFocusSession} />
          </div>

          {/* AI Insight panel (toggleable, mid-bottom) */}
          <AnimatePresence>
            {showInsight && (
              <motion.div
                className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40"
                style={{ width: 'min(300px, calc(100vw - 32px))' }}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
              >
                <AIInsightPanel payload={insightPayload} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="relative z-30 px-4 pb-4 pt-2"
          style={{ background: 'linear-gradient(to top, rgba(4,4,7,0.95) 0%, rgba(4,4,7,0.6) 60%, transparent 100%)' }}
        >
          {/* Quick Actions */}
          <div className="mb-3">
            <QuickActions onAction={handleAction} />
          </div>

          {/* Event strip — horizontally scrollable with touch support */}
          <div className="event-strip">
            {events.map(evt => (
              <EventCard
                key={evt.id}
                evt={evt}
                selected={selectedEvt === evt.id}
                onSelect={() => setSelected(id => id === evt.id ? null : evt.id)}
                onToggle={() => toggleComplete(evt.id)}
              />
            ))}
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <Toast key={toast} msg={toast} onDone={() => {}} />
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
