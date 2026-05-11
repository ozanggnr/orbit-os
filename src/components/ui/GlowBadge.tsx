'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowBadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export default function GlowBadge({ children, color = '#a855f7', className = '' }: GlowBadgeProps) {
  return (
    <motion.span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-mono ${className}`}
      style={{
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color: color,
        boxShadow: `0 0 8px ${color}44`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {children}
    </motion.span>
  );
}
