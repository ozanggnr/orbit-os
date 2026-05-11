'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import { GlassPanel, MetricPill, SectionHeader, ProgressBar, AIBadge, staggerContainer, fadeUp } from '@/components/ui/primitives';
import { signalsData } from '@/data/mockSignals';
import { SIGNAL_CATEGORY_COLORS } from '@/lib/constants';
import { AISignal, SignalFilterType } from '@/types';

const TYPE_META: Record<string, { label: string; color: string }> = {
  insight:        { label: 'Insight',  color: '#a78bfa' },
  recommendation: { label: 'Action',   color: '#34d399' },
  pattern:        { label: 'Pattern',  color: '#22d3ee' },
  alert:          { label: 'Alert',    color: '#f59e0b' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  high:   { label: '●●● High',   color: '#f59e0b' },
  medium: { label: '●●○ Medium', color: '#22d3ee' },
  low:    { label: '●○○ Low',    color: '#34d399' },
};

const FILTERS: { id: SignalFilterType; label: string; color: string }[] = [
  { id: 'all',            label: 'All',        color: '#a78bfa' },
  { id: 'insight',        label: 'Insights',   color: '#a78bfa' },
  { id: 'recommendation', label: 'Actions',    color: '#34d399' },
  { id: 'pattern',        label: 'Patterns',   color: '#22d3ee' },
  { id: 'alert',          label: 'Alerts',     color: '#f59e0b' },
  { id: 'pinned',         label: 'Pinned',     color: '#fbbf24' },
];

function SignalCard({ s, pinned, read, onPin, onRead }: {
  s: AISignal; pinned: boolean; read: boolean;
  onPin: () => void; onRead: () => void;
}) {
  const t   = TYPE_META[s.type];
  const cat = SIGNAL_CATEGORY_COLORS[s.category];
  const priority = s.confidence >= 90 ? 'high' : s.confidence >= 70 ? 'medium' : 'low';
  const p = PRIORITY_MAP[priority];

  return (
    <motion.div variants={fadeUp} layout>
      <GlassPanel
        className="relative overflow-hidden"
        style={{ opacity: read ? 0.62 : 1, transition: 'opacity 0.3s' }}
      >
        {/* Left accent */}
        <div className="signal-accent" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}88` }} />

        <div className="flex items-start gap-4 p-5 pl-6">
          {/* Icon */}
          <div
            className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 text-xl"
            style={{ background: `${cat}1a`, border: `1px solid ${cat}30` }}
          >
            {s.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap gap-2">
                <MetricPill color={t.color}>{t.label}</MetricPill>
                <MetricPill color={cat}>{s.category}</MetricPill>
                <MetricPill color={p.color} className="hidden sm:inline-flex">{p.label}</MetricPill>
              </div>
              {/* Action buttons */}
              <div className="flex gap-1.5 shrink-0">
                <motion.button
                  title={pinned ? 'Unpin' : 'Pin this signal'}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                  style={{
                    background: pinned ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${pinned ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: pinned ? '#fbbf24' : 'var(--text-400)',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onPin}
                >
                  📌
                </motion.button>
                <motion.button
                  title={read ? 'Mark unread' : 'Mark as read'}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: read ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${read ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    color: read ? '#34d399' : 'var(--text-400)',
                    cursor: 'pointer',
                    fontSize: 10,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onRead}
                >
                  {read ? '✓' : '○'}
                </motion.button>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: read ? 'var(--text-300)' : 'var(--text-100)', marginBottom: 6 }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-300)' }}>
              {s.body}
            </p>

            {/* Bottom row */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>Confidence</span>
                <div style={{ width: 64 }}>
                  <ProgressBar value={s.confidence} color={cat} height={2} />
                </div>
                <span style={{ fontSize: 10, color: cat, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{s.confidence}%</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
                {s.timestamp.slice(11,16)}
              </span>
              {pinned && <span style={{ fontSize: 10, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>📌 pinned</span>}
              {read  && <span style={{ fontSize: 10, color: '#34d399', fontFamily: 'var(--font-mono)' }}>✓ read</span>}
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function SignalsPage() {
  const [filter, setFilter]   = useState<SignalFilterType>('all');
  const [pinned, setPinned]   = useState<Set<string>>(new Set());
  const [read, setRead]       = useState<Set<string>>(new Set());

  const togglePin  = (id: string) => setPinned(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleRead = (id: string) => setRead (prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const signals = useMemo(() => {
    if (filter === 'all')    return signalsData;
    if (filter === 'pinned') return signalsData.filter(s => pinned.has(s.id));
    return signalsData.filter(s => s.type === filter);
  }, [filter, pinned]);

  const avgConf = Math.round(signalsData.reduce((a, s) => a + s.confidence, 0) / signalsData.length);
  const unread  = signalsData.filter(s => !read.has(s.id)).length;

  return (
    <AppShell>
      <div className="page-inner">
        <SectionHeader
          title="Signals"
          subtitle="AI-generated insights, patterns, and recommendations from your personal data."
          right={<AIBadge label={`AI · ${unread} unread`} />}
        />

        {/* Stats */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" variants={staggerContainer} initial="hidden" animate="show">
          {[
            { label: 'Total Signals',   value: signalsData.length,                                       color: '#a78bfa' },
            { label: 'Unread',          value: unread,                                                   color: '#22d3ee' },
            { label: 'Pinned',          value: pinned.size,                                              color: '#fbbf24' },
            { label: 'Avg Confidence',  value: `${avgConf}%`,                                           color: '#f59e0b' },
          ].map(m => (
            <motion.div key={m.label} variants={fadeUp}>
              <GlassPanel className="p-4 text-center">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: m.color, letterSpacing: '-0.02em' }}>{m.value}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-300)', fontFamily: 'var(--font-display)', fontWeight: 500, marginTop: 4 }}>{m.label}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter pills — horizontally scrollable on mobile */}
        <motion.div
          className="flex gap-2 mb-6 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
          variants={fadeUp} initial="hidden" animate="show"
        >
          {FILTERS.map(f => {
            const active = filter === f.id;
            return (
              <motion.button
                key={f.id}
                className="px-3 py-1.5 rounded-full text-xs font-medium shrink-0"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: active ? `${f.color}22` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? f.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? f.color : 'var(--text-400)',
                  cursor: 'pointer',
                  boxShadow: active ? `0 0 12px ${f.color}22` : 'none',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                {f.id === 'pinned' && pinned.size > 0 && (
                  <span className="ml-1" style={{ opacity: 0.8 }}>({pinned.size})</span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Signal feed */}
        <AnimatePresence mode="popLayout">
          {signals.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassPanel className="p-10 text-center">
                <p style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>📌</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-300)' }}>
                  {filter === 'pinned' ? 'No pinned signals yet — pin important ones using the 📌 button.' : 'No signals match this filter.'}
                </p>
              </GlassPanel>
            </motion.div>
          ) : (
            <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
              {signals.map((s, i) => (
                <SignalCard
                  key={s.id} s={s}
                  pinned={pinned.has(s.id)}
                  read={read.has(s.id)}
                  onPin={() => togglePin(s.id)}
                  onRead={() => toggleRead(s.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
