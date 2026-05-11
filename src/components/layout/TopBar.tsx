'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { mockUser } from '@/lib/mockData';
import { MOOD_COLORS } from '@/lib/constants';
import { LiveDot } from '@/components/ui/primitives';

export default function TopBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const mood = MOOD_COLORS[mockUser.currentMood];

  return (
    <header
      className="topbar-fixed fixed top-0 right-0 z-40 flex items-center gap-3 sm:gap-5 px-4 sm:px-6 h-[60px] min-w-0"
      style={{
        left: 'var(--nav-w)',
        background: 'rgba(4,4,7,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Clock — hidden on mobile (md and below to save space) */}
      <div className="hidden sm:flex items-baseline gap-2 min-w-0 shrink-0">
        <span
          className="tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 400, color: 'var(--text-200)', letterSpacing: '-0.01em' }}
        >
          {time}
        </span>
        <span className="hidden md:inline" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', fontFamily: 'var(--font-body)' }}>
          {date}
        </span>
      </div>

      {/* Mobile: app name */}
      <div className="flex sm:hidden min-w-0">
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-100)', letterSpacing: '-0.02em' }}>
          Orbit OS
        </span>
      </div>

      <div className="flex-1 min-w-0" />

      {/* Mood chip */}
      <motion.div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shrink-0"
        style={{ background: `${mood.core}18`, border: `1px solid ${mood.core}38` }}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <LiveDot color={mood.glow} />
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 500, color: mood.core }}>
          {mood.text}
        </span>
      </motion.div>

      {/* Energy — hidden on xs, shown from sm up */}
      <motion.div
        className="hidden sm:flex items-center gap-2 shrink-0"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="hidden md:inline" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>Energy</span>
        <div style={{ width: 56, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 99, boxShadow: '0 0 6px rgba(52,211,153,0.5)' }}
            initial={{ width: 0 }}
            animate={{ width: `${mockUser.energyLevel}%` }}
            transition={{ duration: 1.2, ease: [0.16,1,0.3,1], delay: 0.8 }}
          />
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
          {mockUser.energyLevel}%
        </span>
      </motion.div>
    </header>
  );
}
