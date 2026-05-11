'use client';

import { motion } from 'framer-motion';
import CentralOrb from './CentralOrb';
import { OrbitEvent, UserProfile } from '@/types';

interface OrbitCanvasProps {
  user: UserProfile;
  events: OrbitEvent[];
}

// Fixed logical canvas size — CSS scale applied at the scene level
const RADII  = [230, 340, 460];
const SPEEDS = [85, 125, 165];
const SIZE_MAP = { 1: 30, 2: 42, 3: 56 } as const;
const CANVAS_W = 960;
const CANVAS_H = 960;

export default function OrbitCanvas({ user, events }: OrbitCanvasProps) {
  const rings: OrbitEvent[][] = [[], [], []];
  events.forEach(e => { if (e.orbitIndex >= 0 && e.orbitIndex < 3) rings[e.orbitIndex].push(e); });

  return (
    /* orbit-scene applies responsive height + overflow:hidden via CSS */
    <div className="orbit-scene w-full">
      {/* orbit-canvas-inner is scaled via CSS @media queries in globals.css */}
      <div
        className="orbit-canvas-inner relative flex items-center justify-center"
        style={{ width: CANVAS_W, height: CANVAS_H }}
      >
        {/* ── Static orbit rings ── */}
        {RADII.map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: r * 2, height: r * 2,
              border: `1px solid rgba(139,92,246,${0.1 - i * 0.025})`,
              boxShadow: `0 0 ${24 + i * 12}px rgba(139,92,246,${0.04 - i * 0.01})`,
            }}
          />
        ))}

        {/* ── Rotating planet groups ── */}
        {rings.map((ringEvents, ri) => {
          if (!ringEvents.length) return null;
          const r     = RADII[ri];
          const speed = SPEEDS[ri];
          const step  = 360 / ringEvents.length;
          const dir   = ri % 2 === 0;

          return (
            <motion.div
              key={ri}
              className="absolute"
              style={{ width: 0, height: 0, left: '50%', top: '50%' }}
              animate={{ rotate: dir ? 360 : -360 }}
              transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
            >
              {ringEvents.map((evt, ei) => {
                const angle = ei * step;
                const rad   = (angle * Math.PI) / 180;
                const x     = Math.cos(rad) * r;
                const y     = Math.sin(rad) * r;
                const size  = SIZE_MAP[evt.importance];

                return (
                  <motion.div
                    key={evt.id}
                    className="absolute group"
                    style={{ width: size, height: size, left: x - size / 2, top: y - size / 2, cursor: 'pointer' }}
                    // Counter-rotate to keep planet upright
                    animate={{ rotate: dir ? -360 : 360 }}
                    transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                    whileHover={{ scale: 1.22, zIndex: 60 }}
                  >
                    {/* Planet body */}
                    <div
                      className="w-full h-full rounded-full relative flex items-center justify-center"
                      style={{
                        background: evt.completed
                          ? `radial-gradient(circle at 35% 30%, ${evt.color}99, ${evt.color}44)`
                          : `radial-gradient(circle at 35% 30%, ${evt.color}ff, ${evt.color}cc)`,
                        boxShadow: evt.completed
                          ? `0 0 8px ${evt.color}44`
                          : `0 0 14px ${evt.color}88, 0 0 28px ${evt.color}33`,
                        opacity: evt.completed ? 0.52 : 1,
                        border: `1px solid ${evt.color}66`,
                      }}
                    >
                      {/* Specular */}
                      <div className="absolute rounded-full pointer-events-none"
                        style={{ width: '36%', height: '36%', top: '10%', left: '14%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
                      />
                      <span style={{ fontSize: size * 0.3, color: 'rgba(255,255,255,0.88)', lineHeight: 1 }}>
                        {evt.completed ? '✓' : '◆'}
                      </span>
                    </div>

                    {/* Tooltip */}
                    <div
                      className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                      style={{ bottom: size + 10, left: '50%', transform: 'translateX(-50%)', minWidth: 128, zIndex: 70 }}
                    >
                      <div className="glass-panel px-3 py-2 text-center" style={{ borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 600, color: evt.color, whiteSpace: 'nowrap' }}>
                          {evt.title}
                        </p>
                        <p style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-400)', marginTop: 2 }}>
                          {evt.startTime.slice(11, 16)} — {evt.type}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}

        {/* ── Central Orb ── */}
        <div className="absolute" style={{ zIndex: 20 }}>
          <CentralOrb mood={user.currentMood} energyLevel={user.energyLevel} userName={user.name} />
        </div>
      </div>
    </div>
  );
}
