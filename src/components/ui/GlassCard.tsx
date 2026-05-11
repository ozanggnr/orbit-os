'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  style,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-2xl ${hover ? 'cursor-pointer transition-all duration-300' : ''} ${className}`}
      style={style}
      whileHover={hover ? { scale: 1.02, borderColor: 'rgba(255,255,255,0.14)' } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
