'use client';

import { motion } from 'framer-motion';
import { FocusSession } from '@/types';
import { GlassPanel } from '@/components/ui/primitives';
import { useState } from 'react';

const MODES = {
  pomodoro: { label: 'Pomodoro',   icon: '🍅', color: '#f59e0b' },
  deep:     { label: 'Deep Work',  icon: '🌊', color: '#22d3ee' },
  flow:     { label: 'Flow State', icon: '⚡', color: '#a78bfa' },
};

export default function FocusTimer({ session }: { session: FocusSession }) {
  const [active, setActive] = useState(session.isActive);
  const m = MODES[session.mode];
  const circ = 2 * Math.PI * 36;
  const progress = session.elapsed / (session.duration * 60);
  const remaining = session.duration * 60 - session.elapsed;
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16,1,0.3,1], delay: 0.9 }}
      className="animate-float"
      style={{ animationDuration: '6.5s', animationDelay: '0.5s' }}
    >
      <GlassPanel className="p-4" style={{ minWidth: 210 }}>
        <div className="flex items-center gap-4">
          {/* SVG ring timer */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <motion.circle
                cx="42" cy="42" r="36" fill="none"
                stroke={m.color} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
                style={{ filter: `drop-shadow(0 0 4px ${m.color}cc)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--text-100)', letterSpacing: '-0.01em' }}>
                {fmt(remaining)}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 500, color: m.color, marginBottom: 2 }}>
              {m.icon} {m.label}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', marginBottom: 12 }}>
              Session {session.sessionsCompleted + (active ? 1 : 0)} today
            </p>

            <motion.button
              className="w-full rounded-xl py-1.5 text-xs font-medium"
              style={{
                fontFamily: 'var(--font-display)',
                background: active ? 'rgba(239,68,68,0.14)' : `${m.color}1e`,
                border: `1px solid ${active ? 'rgba(239,68,68,0.4)' : m.color + '44'}`,
                color: active ? '#f87171' : m.color,
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(!active)}
            >
              {active ? '⏸ Pause' : '▶ Start'}
            </motion.button>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
