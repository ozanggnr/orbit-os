'use client';

import { motion } from 'framer-motion';
import { OrbitEvent } from '@/types';
import { EVENT_TYPE_ICONS } from '@/lib/constants';
import { useState } from 'react';

interface PlanetNodeProps {
  event: OrbitEvent;
  angle: number; // degrees
  orbitRadius: number;
}

const IMPORTANCE_SIZES = { 1: 28, 2: 38, 3: 50 } as const;
const URGENCY_DURATIONS = { low: 75, medium: 55, high: 38 } as const;

export default function PlanetNode({ event, angle, orbitRadius }: PlanetNodeProps) {
  const [hovered, setHovered] = useState(false);
  const size = IMPORTANCE_SIZES[event.importance];
  const orbitDuration = URGENCY_DURATIONS[event.urgency];

  // The planet sits on a rotating container
  // so we position it at the right angle on the ring
  const rads = (angle * Math.PI) / 180;
  const x = Math.cos(rads) * orbitRadius;
  const y = Math.sin(rads) * orbitRadius;

  return (
    <motion.div
      className="absolute flex items-center justify-center cursor-pointer"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        x: x - size / 2,
        y: y - size / 2,
        zIndex: hovered ? 30 : 10,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        rotate: {
          duration: orbitDuration,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      {/* Planet body */}
      <motion.div
        className="relative rounded-full flex items-center justify-center select-none"
        style={{
          width: size,
          height: size,
          background: event.completed
            ? `radial-gradient(circle at 35% 30%, ${event.color}cc, ${event.color}66)`
            : `radial-gradient(circle at 35% 30%, ${event.color}, ${event.color}99)`,
          boxShadow: hovered
            ? `0 0 20px ${event.color}cc, 0 0 40px ${event.color}66`
            : `0 0 10px ${event.color}88`,
          opacity: event.completed ? 0.6 : 1,
          border: `1px solid ${event.color}44`,
        }}
        whileHover={{ scale: 1.18 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Highlight shimmer */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 0.38,
            height: size * 0.38,
            top: size * 0.1,
            left: size * 0.15,
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Icon */}
        <span
          className="z-10 leading-none"
          style={{
            fontSize: size * 0.35,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {EVENT_TYPE_ICONS[event.type]}
        </span>

        {/* Completed checkmark overlay */}
        {event.completed && (
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <span style={{ fontSize: size * 0.3, color: 'rgba(255,255,255,0.7)' }}>✓</span>
          </div>
        )}
      </motion.div>

      {/* Tooltip on hover */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute pointer-events-none"
          style={{
            bottom: size + 8,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}
        >
          <div
            className="glass rounded-xl px-3 py-2 text-center"
            style={{ minWidth: 120, maxWidth: 180 }}
          >
            <p
              className="text-xs font-semibold leading-tight"
              style={{ color: event.color, fontFamily: 'var(--font-display)' }}
            >
              {event.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {event.startTime.slice(11, 16)} – {event.endTime.slice(11, 16)}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
