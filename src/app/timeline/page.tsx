'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import { GlassPanel, MetricPill, SectionHeader, ProgressBar, AIBadge, Divider, staggerContainer, fadeUp, scaleIn } from '@/components/ui/primitives';
import { mockWeekDays, mockMetrics } from '@/lib/mockData';
import { todayTimeline, weekRecap, monthSummaries } from '@/data/mockTimeline';
import { metricsData, weekDaysData } from '@/data/mockUser';
import { TimelineView, TimelineEntry } from '@/types';
import { generateDailyRecap, InsightContext } from '@/lib/mock-ai';
import { mockUser, mockMusic, mockWeather } from '@/lib/mockData';

const TYPE_COLORS: Record<string, string> = {
  task: '#fbbf24', meeting: '#22d3ee', focus: '#a78bfa',
  break: '#34d399', habit: '#34d399', insight: '#22d3ee',
};
const TYPE_ICONS: Record<string, string> = {
  task: '◆', meeting: '◉', focus: '◈', break: '◎', habit: '◍', insight: '✦',
};

/* ── Tab switcher ─────────────────────────────────────────────── */
function ViewTabs({ active, onChange }: { active: TimelineView; onChange: (v: TimelineView) => void }) {
  const tabs: { id: TimelineView; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week',  label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];
  return (
    <div
      className="flex gap-1 p-1 rounded-xl overflow-x-auto"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'inline-flex', maxWidth: '100%' }}
    >
      {tabs.map(t => (
        <motion.button
          key={t.id}
          className="relative px-4 py-1.5 rounded-lg text-xs font-medium"
          style={{
            fontFamily: 'var(--font-display)',
            color: active === t.id ? 'var(--text-100)' : 'var(--text-400)',
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
          }}
          onClick={() => onChange(t.id)}
          whileTap={{ scale: 0.97 }}
        >
          {active === t.id && (
            <motion.div
              layoutId="tab-bg"
              className="absolute inset-0 rounded-lg"
              style={{ background: 'rgba(139,92,246,0.22)', border: '1px solid rgba(139,92,246,0.35)' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>{t.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ── Expandable timeline entry ────────────────────────────────── */
function TimelineNode({ entry, index, expanded, onToggle }: {
  entry: TimelineEntry; index: number; expanded: boolean; onToggle: () => void;
}) {
  const color = TYPE_COLORS[entry.type] ?? '#a78bfa';
  const icon  = TYPE_ICONS[entry.type]  ?? '◆';

  return (
    <motion.div className="relative" variants={fadeUp}>
      {/* Timeline dot + connector */}
      <div className="absolute -left-[37px] flex flex-col items-center" style={{ top: 18 }}>
        <motion.div
          className="w-3 h-3 rounded-full flex items-center justify-center"
          style={{
            background: entry.completed ? 'transparent' : color,
            border: `2px solid ${color}`,
            boxShadow: entry.completed ? 'none' : `0 0 8px ${color}88`,
            fontSize: 6, color: '#fff',
          }}
          animate={entry.highlight && !entry.completed ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {entry.completed ? <span style={{ fontSize: 7, color }}>✓</span> : null}
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        className="cursor-pointer"
        onClick={onToggle}
        animate={{ borderColor: expanded ? `${color}44` : 'rgba(255,255,255,0.07)' }}
      >
        <GlassPanel className={`overflow-hidden ${entry.highlight ? '' : ''}`}
          style={{ boxShadow: entry.highlight ? `0 0 24px ${color}22, 0 4px 20px rgba(0,0,0,0.45)` : undefined }}
        >
          {entry.highlight && (
            <div style={{ height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color, fontWeight: 500 }}>
                    {icon} {entry.time}
                  </span>
                  <MetricPill color={color}>{entry.type}</MetricPill>
                  {entry.highlight && <MetricPill color="#fbbf24">★ Highlight</MetricPill>}
                  {entry.completed && <MetricPill color="#34d399">✓ Done</MetricPill>}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)',
                  color: entry.completed ? 'var(--text-300)' : 'var(--text-100)',
                }}>
                  {entry.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {entry.duration && (
                  <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    {entry.duration}
                  </span>
                )}
                <motion.span
                  style={{ color: 'var(--text-400)', fontSize: 12 }}
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  ▾
                </motion.span>
              </div>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
                >
                  <Divider className="mt-3 mb-3" />
                  <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-300)', marginBottom: 10 }}>
                    {entry.description}
                  </p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {entry.tags.map(tag => (
                        <MetricPill key={tag} color={color} className="text-[10px]">#{tag}</MetricPill>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

/* ── AI Recap Card ─────────────────────────────────────────────── */
function AIRecapCard() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [recap, setRecap]   = useState<string>('');

  const generate = useCallback(async () => {
    setStatus('loading');
    const ctx: InsightContext = {
      mood: mockUser.currentMood, energyLevel: mockUser.energyLevel,
      tasksCompleted: 3, totalTasks: 6, focusHours: metricsData.focusHoursToday,
      streak: metricsData.streakDays, musicPlaying: mockMusic.isPlaying,
      weather: mockWeather.condition, hour: new Date().getHours(),
    };
    const result = await generateDailyRecap(ctx);
    setRecap(result);
    setStatus('done');
  }, []);

  return (
    <GlassPanel className="p-5 mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <AIBadge label="AI · Day Recap (Mock)" />
        <motion.button
          className="px-3 py-1.5 rounded-xl text-xs font-medium"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'rgba(167,139,250,0.12)',
            border: '1px solid rgba(167,139,250,0.3)',
            color: '#a78bfa',
            cursor: status === 'loading' ? 'default' : 'pointer',
          }}
          whileHover={status !== 'loading' ? { scale: 1.03 } : undefined}
          whileTap={status !== 'loading' ? { scale: 0.97 } : undefined}
          onClick={status !== 'loading' ? generate : undefined}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '⟳ Generating…' : status === 'done' ? '↺ Regenerate' : '✦ Generate Recap'}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.p key="idle" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-400)', lineHeight: 1.65 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Generate an AI-powered narrative recap of your day based on your events, habits, energy, and mood.
          </motion.p>
        )}
        {status === 'loading' && (
          <motion.div key="loading" className="flex items-center gap-3 py-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa' }}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: '#a78bfa', fontFamily: 'var(--font-display)' }}>AI is composing your recap…</span>
          </motion.div>
        )}
        {status === 'done' && (
          <motion.p key="done" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.75, color: 'var(--text-200)' }}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {recap}
          </motion.p>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}

/* ── Week view ─────────────────────────────────────────────────── */
function WeekView() {
  return (
    <div className="space-y-4">
      {/* Week recap narrative */}
      <GlassPanel className="p-5">
        <MetricPill color="#a78bfa" dot className="mb-3">AI · Week Recap</MetricPill>
        <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.75, color: 'var(--text-200)' }}>{weekRecap}</p>
      </GlassPanel>

      {/* Day cards */}
      <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
        {weekDaysData.map((d, i) => (
          <motion.div key={d.day} variants={scaleIn}>
            <GlassPanel className="p-4" hover style={{ borderLeft: d.active ? '3px solid #a78bfa' : '3px solid transparent' }}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center shrink-0" style={{ minWidth: 48 }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>{d.day}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: d.active ? '#a78bfa' : 'var(--text-100)' }}>{d.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <MetricPill color={d.active ? '#a78bfa' : '#22d3ee'}>{d.mood}</MetricPill>
                    <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>
                      {d.tasksCompleted}/{d.totalTasks} tasks · {d.events} events
                    </span>
                  </div>
                  <ProgressBar value={d.energy} color={d.active ? '#a78bfa' : '#22d3ee'} height={3} delay={i * 0.05} />
                  <div className="flex justify-between mt-1">
                    <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>Energy</span>
                    <span style={{ fontSize: 10, color: d.active ? '#a78bfa' : '#22d3ee', fontFamily: 'var(--font-mono)' }}>{d.energy}%</span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Month view ────────────────────────────────────────────────── */
function MonthView() {
  return (
    <div className="space-y-4">
      <GlassPanel className="p-5">
        <p className="text-label mb-4">MAY 2026 — MONTH OVERVIEW</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Focus Hours',  value: '22h',  color: '#a78bfa' },
            { label: 'Tasks Done',   value: '48',   color: '#34d399' },
            { label: 'Avg Energy',   value: '71%',  color: '#fbbf24' },
            { label: 'Habit Rate',   value: '67%',  color: '#f472b6' },
          ].map(m => (
            <div key={m.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: m.color, lineHeight: 1 }}>{m.value}</p>
              <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{m.label}</p>
            </div>
          ))}
        </div>
      </GlassPanel>

      <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
        {monthSummaries.map((w, i) => (
          <motion.div key={w.week} variants={fadeUp}>
            <GlassPanel className="p-4" hover>
              <div className="flex items-start gap-4">
                <div className="text-center shrink-0">
                  <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>WEEK</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: '#a78bfa' }}>{w.week}</p>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{w.label}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-300)', lineHeight: 1.6 }}>{w.highlight}</p>
                  <div className="flex gap-3 mt-3 flex-wrap">
                    <MetricPill color="#22d3ee">{w.focusHours}h focus</MetricPill>
                    <MetricPill color="#34d399">{w.tasksCompleted} tasks</MetricPill>
                    <MetricPill color="#fbbf24">{w.avgEnergy}% energy</MetricPill>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function TimelinePage() {
  const [view, setView]       = useState<TimelineView>('today');
  const [expanded, setExp]    = useState<string | null>(null);

  const toggleEntry = (id: string) => setExp(e => e === id ? null : id);

  return (
    <AppShell>
      <div className="page-inner">
        <SectionHeader
          title="Timeline"
          subtitle="Your day, week, and patterns — narrated by AI."
          right={<AIBadge label="AI · Recap" />}
        />

        {/* View tabs */}
        <motion.div className="mb-6" variants={fadeUp} initial="hidden" animate="show">
          <ViewTabs active={view} onChange={setView} />
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'today' && (
            <motion.div key="today" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {/* Metrics row */}
              <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" variants={staggerContainer} initial="hidden" animate="show">
                {[
                  { label: 'Focus Today',   value: `${metricsData.focusHoursToday}h`, color: '#a78bfa', sub: `${metricsData.focusHoursWeek}h this week` },
                  { label: 'Tasks Done',    value: `3/6`,                             color: '#34d399', sub: 'today' },
                  { label: 'Energy Avg',    value: `${metricsData.energyAvgWeek}%`,   color: '#fbbf24', sub: 'this week' },
                  { label: 'Habit Rate',    value: `${metricsData.habitCompletionRate}%`, color: '#f472b6', sub: 'last 30 days' },
                ].map(m => (
                  <motion.div key={m.label} variants={fadeUp}>
                    <GlassPanel className="p-4 text-center">
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: m.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-200)', fontFamily: 'var(--font-display)', fontWeight: 500, marginTop: 6 }}>{m.label}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{m.sub}</p>
                    </GlassPanel>
                  </motion.div>
                ))}
              </motion.div>

              {/* AI Recap */}
              <AIRecapCard />

              {/* Timeline entries */}
              <p className="text-label mb-5">TODAY'S EVENTS — TAP TO EXPAND</p>
              <div className="relative pl-10">
                <div className="timeline-line" />
                <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="show">
                  {todayTimeline.map((entry, i) => (
                    <TimelineNode
                      key={entry.id} entry={entry} index={i}
                      expanded={expanded === entry.id}
                      onToggle={() => toggleEntry(entry.id)}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {view === 'week' && (
            <motion.div key="week" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <WeekView />
            </motion.div>
          )}

          {view === 'month' && (
            <motion.div key="month" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <MonthView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
