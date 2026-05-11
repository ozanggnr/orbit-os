'use client';

import { motion } from 'framer-motion';
import { MusicTrack } from '@/types';
import { GlassPanel, LiveDot } from '@/components/ui/primitives';

const BAR = 18;

export default function MusicPlayer({ track }: { track: MusicTrack }) {
  const elapsed  = Math.floor((track.progress / 100) * track.duration);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16,1,0.3,1], delay: 0.7 }}
      className="animate-float-r"
      style={{ animationDuration: '7s', animationDelay: '2s' }}
    >
      <GlassPanel className="p-4" style={{ minWidth: 250 }} hover>
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          <LiveDot color="#a78bfa" />
          <span className="text-label">{track.isPlaying ? 'Now Playing' : 'Paused'}</span>
        </div>

        {/* Visualizer + info */}
        <div className="flex items-center gap-3">
          {/* Bars */}
          <div className="flex items-end gap-px h-7 shrink-0">
            {Array.from({ length: BAR }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-sm"
                style={{ width: 2.5, background: 'linear-gradient(to top, #6d28d9, #a78bfa)' }}
                animate={track.isPlaying ? {
                  height: [`${4 + Math.random() * 16}px`, `${8 + Math.random() * 18}px`, `${3 + Math.random() * 14}px`],
                } : { height: '3px' }}
                transition={{ duration: 0.35 + Math.random() * 0.3, repeat: Infinity, repeatType: 'reverse', delay: i * 0.035, ease: 'easeInOut' }}
              />
            ))}
          </div>

          {/* Track info */}
          <div className="overflow-hidden flex-1">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-100)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {track.title}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-300)', marginTop: 1 }}>
              {track.artist}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3.5">
          <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', boxShadow: '0 0 6px rgba(167,139,250,0.5)', borderRadius: 99 }}
              initial={{ width: 0 }}
              animate={{ width: `${track.progress}%` }}
              transition={{ duration: 1.1, ease: [0.16,1,0.3,1], delay: 1.2 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>{fmt(elapsed)}</span>
            <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>{fmt(track.duration)}</span>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
