'use client';

import { motion } from 'framer-motion';
import { WeatherData } from '@/types';
import { GlassPanel } from '@/components/ui/primitives';

export default function WeatherBeacon({ data }: { data: WeatherData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16,1,0.3,1], delay: 0.5 }}
      className="animate-float"
      style={{ animationDuration: '6s', animationDelay: '1s' }}
    >
      <GlassPanel className="px-4 py-3.5" hover style={{ minWidth: 168 }}>
        <div className="flex items-center gap-3">
          <motion.span
            className="text-3xl leading-none"
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            {data.icon}
          </motion.span>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--text-100)', letterSpacing: '-0.02em' }}>
                {data.temperature}°
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)' }}>
                feels {data.feelsLike}°
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: '#22d3ee', fontFamily: 'var(--font-display)', fontWeight: 500, marginTop: 1 }}>
              {data.condition}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>
                📍 {data.city} · {data.humidity}% hum
              </span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
