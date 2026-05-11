'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

const NavIcons = {
  orbit: (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[18px] h-[18px]">
      <circle cx="11" cy="11" r="2.5" fill="currentColor" strokeWidth="0" />
      <ellipse cx="11" cy="11" rx="9.5" ry="4" strokeOpacity="0.6" />
      <ellipse cx="11" cy="11" rx="9.5" ry="4" transform="rotate(55 11 11)" strokeOpacity="0.4" />
      <ellipse cx="11" cy="11" rx="9.5" ry="4" transform="rotate(-55 11 11)" strokeOpacity="0.25" />
    </svg>
  ),
  timeline: (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[18px] h-[18px]">
      <circle cx="6"  cy="11" r="1.8" fill="currentColor" strokeWidth="0" />
      <circle cx="11" cy="11" r="1.8" fill="currentColor" strokeWidth="0" />
      <circle cx="16" cy="11" r="1.8" fill="currentColor" strokeWidth="0" />
      <line x1="3" y1="11" x2="19" y2="11" strokeOpacity="0.3" />
      <line x1="6"  y1="11" x2="6"  y2="6.5"  strokeLinecap="round" />
      <line x1="11" y1="11" x2="11" y2="15"   strokeLinecap="round" />
      <line x1="16" y1="11" x2="16" y2="7.5"  strokeLinecap="round" />
    </svg>
  ),
  signals: (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[18px] h-[18px]">
      <path d="M1.5 11 C3 11 4 5.5 7 5.5 S10 16.5 13 16.5 S16.5 11 18 11" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="18" y1="11" x2="20.5" y2="11" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  ),
  constellations: (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-[18px] h-[18px]">
      <circle cx="4.5"  cy="4.5"  r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="18"   cy="6.5"  r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="11.5" cy="13"   r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="5.5"  cy="18"   r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="17.5" cy="17.5" r="1.5" fill="currentColor" strokeWidth="0" />
      <line x1="4.5"  y1="4.5"  x2="18"   y2="6.5"  strokeOpacity="0.35" />
      <line x1="18"   y1="6.5"  x2="11.5" y2="13"   strokeOpacity="0.35" />
      <line x1="11.5" y1="13"   x2="5.5"  y2="18"   strokeOpacity="0.35" />
      <line x1="11.5" y1="13"   x2="17.5" y2="17.5" strokeOpacity="0.35" />
      <line x1="4.5"  y1="4.5"  x2="11.5" y2="13"   strokeOpacity="0.15" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[18px] h-[18px]">
      <circle cx="11" cy="11" r="2.8" />
      <path d="M11 2v1.8M11 18.2V20M4.1 4.1l1.3 1.3M16.6 16.6l1.3 1.3M2 11h1.8M18.2 11H20M4.1 17.9l1.3-1.3M16.6 5.4l1.3-1.3" strokeLinecap="round" />
    </svg>
  ),
};

export default function SideNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop side nav */}
      <nav
        className="fixed left-0 top-0 h-full z-50 hidden md:flex flex-col items-center py-7 gap-1.5"
        style={{
          width: 'var(--nav-w)',
          background: 'rgba(4,4,7,0.75)',
          backdropFilter: 'blur(24px) saturate(140%)',
          borderRight: '1px solid rgba(255,255,255,0.045)',
        }}
      >
        {/* Logo orb */}
        <Link href="/orbit" className="mb-8" aria-label="Orbit OS Home">
          <motion.div
            className="w-8 h-8 rounded-full"
            style={{ background: 'radial-gradient(circle at 38% 32%, #c084fc, #7c3aed 55%, #1e0a3c)' }}
            animate={{ boxShadow: ['0 0 18px rgba(168,85,247,0.55)', '0 0 28px rgba(168,85,247,0.85)', '0 0 18px rgba(168,85,247,0.55)'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </Link>

        {/* Nav links */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.id} href={item.href} className="relative group" aria-label={item.label}>
                <motion.div
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                  animate={{
                    background: active ? 'rgba(139,92,246,0.18)' : 'rgba(0,0,0,0)',
                    color: active ? '#a78bfa' : 'rgba(248,250,252,0.3)',
                  }}
                  whileHover={{ scale: 1.06, color: active ? '#a78bfa' : 'rgba(248,250,252,0.7)' }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.2 }}
                  style={{ border: active ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent' }}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl"
                      style={{ boxShadow: '0 0 14px rgba(139,92,246,0.45)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {NavIcons[item.icon as keyof typeof NavIcons]}
                </motion.div>

                {/* Tooltip */}
                <span
                  className="absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap
                    pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    background: 'rgba(8,8,16,0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-200)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Avatar */}
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold select-none"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 0 12px rgba(139,92,246,0.4)',
            color: '#fff',
          }}
          whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(139,92,246,0.65)' }}
        >
          AN
        </motion.div>
      </nav>

      {/* Mobile bottom nav */}
      <nav
        className="bottom-nav-fixed fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-evenly px-1 py-2"
        style={{
          background: 'rgba(4,4,7,0.92)',
          backdropFilter: 'blur(24px) saturate(140%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.id} href={item.href} aria-label={item.label} className="flex-1 flex justify-center">
              <motion.div
                className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl"
                style={{
                  background: active ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: active ? '#a78bfa' : 'rgba(248,250,252,0.35)',
                  minWidth: 44,
                }}
                whileTap={{ scale: 0.9 }}
              >
                {NavIcons[item.icon as keyof typeof NavIcons]}
                <span style={{ fontSize: 9, fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
