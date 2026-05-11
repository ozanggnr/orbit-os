'use client';

import { ReactNode } from 'react';
import SideNav from './SideNav';
import TopBar from './TopBar';
import AmbientBackground from '@/components/ui/AmbientBackground';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--void)' }}>
      {/* Layers: background → ambient → noise → content */}
      <AmbientBackground />
      <div className="noise-overlay" aria-hidden />

      {/* Navigation */}
      <SideNav />
      <TopBar />

      {/* Page content */}
      <main className="page-content">
        {children}
      </main>
    </div>
  );
}
