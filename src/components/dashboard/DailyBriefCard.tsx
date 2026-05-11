'use client';

import { motion } from 'framer-motion';
import { DailyBrief } from '@/types';
import { GlassPanel, AIBadge } from '@/components/ui/primitives';

const INSIGHTS = [
  { key: 'energyForecast' as const, icon: '⚡', label: 'Energy', color: '#fbbf24' },
  { key: 'topPriority'    as const, icon: '🎯', label: 'Priority', color: '#a78bfa' },
  { key: 'weatherNote'    as const, icon: '⛅', label: 'Weather',  color: '#22d3ee' },
];

export default function DailyBriefCard({ brief }: { brief: DailyBrief }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16,1,0.3,1], delay: 0.25 }}
      className="animate-float"
      style={{ animationDuration: '8s' }}
    >
      <GlassPanel className="p-5" style={{ maxWidth: 310 }}>
        {/* Accent bar + greeting */}
        <div className="flex items-center gap-2.5 mb-3">
          <motion.div
            style={{ width: 3, height: 28, borderRadius: 99, background: 'linear-gradient(to bottom, #a78bfa, #22d3ee)' }}
            animate={{ scaleY: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--text-100)' }}>
            {brief.greeting}
          </h2>
        </div>

        {/* Summary */}
        <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--text-300)', marginBottom: 16 }}>
          {brief.summary}
        </p>

        {/* Divider */}
        <div className="divider mb-3" />

        {/* Insight rows */}
        <div className="space-y-2">
          {INSIGHTS.map((item, i) => (
            <motion.div
              key={item.key}
              className="flex gap-2.5 items-start p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.045)' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1 }}>{item.icon}</span>
              <div>
                <span style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 600, color: item.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', lineHeight: 1.55 }}>
                  {brief[item.key]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI badge */}
        <div className="mt-4">
          <AIBadge label="AI · Generated 21:00" />
        </div>
      </GlassPanel>
    </motion.div>
  );
}
