'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

/* ── Shared animation presets ─────────────────────────────── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

/* ── GlassPanel ───────────────────────────────────────────── */
interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  as?: 'div' | 'article' | 'section';
}

export function GlassPanel({
  children, className = '', hover = false, onClick, style
}: GlassPanelProps) {
  return (
    <motion.div
      className={`glass-panel w-full min-w-0 ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`}
      style={style}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={hover && onClick ? { scale: 0.99 } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ── MetricPill ───────────────────────────────────────────── */
interface MetricPillProps {
  children: ReactNode;
  color?: string;
  className?: string;
  dot?: boolean;
  animate?: boolean;
}

export function MetricPill({ children, color = '#a78bfa', className = '', dot = false, animate = false }: MetricPillProps) {
  return (
    <span
      className={`metric-pill ${className}`}
      style={{
        background: `${color}1a`,
        border: `1px solid ${color}40`,
        color,
        boxShadow: `0 0 8px ${color}22`,
      }}
    >
      {dot && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: color }}
          animate={animate ? { opacity: [1, 0.3, 1] } : undefined}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {children}
    </span>
  );
}

/* ── SectionHeader ────────────────────────────────────────── */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, right, className = '' }: SectionHeaderProps) {
  return (
    <motion.div
      className={`flex items-start justify-between gap-3 mb-7 flex-wrap ${className}`}
      variants={fadeUp}
      initial="hidden"
      animate="show"
    >
      <div className="min-w-0">
        <h1 className="text-display" style={{ fontSize: 'clamp(1.125rem, 3vw, var(--text-2xl))', color: 'var(--text-100)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-300)', fontFamily: 'var(--font-body)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </motion.div>
  );
}

/* ── ProgressBar ──────────────────────────────────────────── */
interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  className?: string;
  delay?: number;
}

export function ProgressBar({ value, color = '#a78bfa', height = 3, className = '', delay = 0 }: ProgressBarProps) {
  return (
    <div
      className={`progress-track ${className}`}
      style={{ height }}
    >
      <motion.div
        className="progress-fill"
        style={{ background: color, boxShadow: `0 0 6px ${color}66` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      />
    </div>
  );
}

/* ── Divider ──────────────────────────────────────────────── */
export function Divider({ className = '' }: { className?: string }) {
  return <div className={`divider ${className}`} />;
}

/* ── LiveDot ──────────────────────────────────────────────── */
export function LiveDot({ color = '#a78bfa' }: { color?: string }) {
  return (
    <motion.span
      className="inline-block w-1.5 h-1.5 rounded-full"
      style={{ background: color }}
      animate={{ opacity: [1, 0.2, 1], scale: [1, 1.25, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── AIBadge ──────────────────────────────────────────────── */
export function AIBadge({ label = 'AI · Generated', className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <LiveDot color="#a78bfa" />
      <span className="text-label" style={{ color: 'var(--text-400)' }}>{label}</span>
    </div>
  );
}
