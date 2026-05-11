'use client';

import { motion } from 'framer-motion';
import { MOOD_COLORS } from '@/lib/constants';
import { MoodType } from '@/types';

interface CentralOrbProps {
  mood: MoodType;
  energyLevel: number;
  userName: string;
}

export default function CentralOrb({ mood, energyLevel, userName }: CentralOrbProps) {
  const c = MOOD_COLORS[mood];
  const initials = userName.split(' ').map(n => n[0]).join('');
  const arcLen = 2 * Math.PI * 58;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: 220, height: 220 }}>

      {/* ── Outermost atmosphere ring ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 220, height: 220, background: `radial-gradient(circle, ${c.glow}18 0%, transparent 72%)` }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Mid glow ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 155, height: 155, background: `radial-gradient(circle, ${c.glow}28 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />

      {/* ── Energy SVG arc ── */}
      <svg
        className="absolute pointer-events-none"
        style={{ width: 140, height: 140, top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)' }}
        viewBox="0 0 140 140"
      >
        {/* Track */}
        <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" />
        {/* Fill */}
        <motion.circle
          cx="70" cy="70" r="58" fill="none"
          stroke={c.glow} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={`${arcLen} ${arcLen}`}
          initial={{ strokeDashoffset: arcLen }}
          animate={{ strokeDashoffset: arcLen - (arcLen * energyLevel) / 100 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 1 }}
          style={{ filter: `drop-shadow(0 0 5px ${c.glow}cc)` }}
        />
      </svg>

      {/* ── Orb body ── */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 104, height: 104,
          background: `radial-gradient(circle at 38% 30%, ${c.glow}ff 0%, ${c.core} 45%, #0d0620)`,
          boxShadow: `0 0 50px ${c.glow}88, 0 0 100px ${c.core}44, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}
        animate={{
          scale: [1, 1.028, 1],
          boxShadow: [
            `0 0 50px ${c.glow}88, 0 0 100px ${c.core}44`,
            `0 0 70px ${c.glow}bb, 0 0 140px ${c.core}66`,
            `0 0 50px ${c.glow}88, 0 0 100px ${c.core}44`,
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Specular highlight */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 42, height: 42, top: 11, left: 15,
            background: 'radial-gradient(circle, rgba(255,255,255,0.32) 0%, transparent 70%)',
          }}
        />
        {/* Initials */}
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.04em', zIndex: 1 }}>
          {initials}
        </span>
      </motion.div>

      {/* ── Mood label ── */}
      <motion.div
        className="absolute flex items-center gap-1.5"
        style={{ bottom: 12, left: '50%', transform: 'translateX(-50%)' }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: c.glow }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 500, color: c.core, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {c.text}
        </span>
      </motion.div>
    </div>
  );
}
