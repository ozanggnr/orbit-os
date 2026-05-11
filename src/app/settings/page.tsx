'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import { GlassPanel, MetricPill, SectionHeader, Divider, staggerContainer, fadeUp } from '@/components/ui/primitives';
import { APIConnection } from '@/types';
import { getHealth, HealthResult } from '@/lib/client/api';

/* ── API Connection data ──────────────────────────────────────── */
const API_CONNECTIONS: APIConnection[] = [
  {
    id: 'gemini', name: 'Gemini AI', icon: '✦', color: '#a78bfa',
    description: 'Powers AI insights, daily briefs, signal generation, and recap narratives.',
    envVar: 'GEMINI_API_KEY', docsUrl: 'https://ai.google.dev',
    status: 'disconnected', serverSideOnly: true,
    usedFor: 'Signals page · Daily Brief · AI Recap · Orbit Insights',
    privacyNote: 'Server-side only. Key never exposed to the browser. Used in /api/ai/daily-insight.',
  },
  {
    id: 'gcal', name: 'Google Calendar', icon: '📅', color: '#22d3ee',
    description: 'Syncs your real events, meetings, and schedule to Orbit rings.',
    envVar: 'GOOGLE_CALENDAR_CLIENT_ID + CLIENT_SECRET', docsUrl: 'https://developers.google.com/calendar',
    status: 'disconnected', serverSideOnly: true,
    usedFor: 'Orbit rings · Timeline page · Event completion tracking',
    privacyNote: 'OAuth flow. Client Secret is server-side only. Click Connect to start OAuth.',
  },
  {
    id: 'spotify', name: 'Spotify', icon: '🎵', color: '#34d399',
    description: 'Connects recently-played tracks for music mood and focus correlations.',
    envVar: 'SPOTIFY_CLIENT_ID + CLIENT_SECRET', docsUrl: 'https://developer.spotify.com/dashboard',
    status: 'disconnected', serverSideOnly: true,
    usedFor: 'Music widget · Signals correlations · Constellation music node',
    privacyNote: 'Client Secret is server-side only. CSRF state validated on callback.',
  },
  {
    id: 'openweather', name: 'OpenWeather', icon: '⛅', color: '#fbbf24',
    description: 'Provides live weather data for your location and energy predictions.',
    envVar: 'OPENWEATHER_API_KEY', docsUrl: 'https://openweathermap.org/api',
    status: 'disconnected', serverSideOnly: true,
    usedFor: 'Weather widget · Signals weather insights · Constellation weather node',
    privacyNote: 'Server-side only. Used in /api/weather/current — never sent to browser.',
  },
  {
    id: 'firebase', name: 'Firebase', icon: '🔥', color: '#f59e0b',
    description: 'Authentication, Firestore for data persistence, and real-time sync.',
    envVar: 'NEXT_PUBLIC_FIREBASE_API_KEY + config', docsUrl: 'https://firebase.google.com',
    status: 'coming_soon', serverSideOnly: false,
    usedFor: 'User auth · Habit persistence · Signal history · Cross-device sync',
    privacyNote: 'Public config is safe. Enforce Firestore security rules — no RLS configured by default.',
  },
  {
    id: 'supabase', name: 'Supabase', icon: '⚡', color: '#22d3ee',
    description: 'Alternative backend: Postgres DB + auth + storage + real-time.',
    envVar: 'NEXT_PUBLIC_SUPABASE_URL + ANON_KEY', docsUrl: 'https://supabase.com',
    status: 'coming_soon', serverSideOnly: false,
    usedFor: 'User profiles · Event history · Habit analytics · Settings persistence',
    privacyNote: 'Anon key is public but Row-Level Security (RLS) MUST be configured before production use.',
  },
];

const APPEARANCE_SETTINGS = [
  { id: 'theme',       label: 'Theme',          desc: 'Deep Space (Void)',      icon: '🎨', color: '#a78bfa', defaultOn: true },
  { id: 'orbit-speed', label: 'Orbit Speed',    desc: 'Normal — 1×',           icon: '🌀', color: '#22d3ee', defaultOn: true },
  { id: 'particles',   label: 'Star Field',     desc: 'Ambient stars — On',    icon: '✦',  color: '#fbbf24', defaultOn: true },
  { id: 'reduced',     label: 'Reduced Motion', desc: 'Respect system setting', icon: '♿', color: '#34d399', defaultOn: false },
];

const PRIVACY_SETTINGS = [
  { id: 'local',     label: 'Local Data Only',  desc: 'All data stays on your device — never uploaded', icon: '🔒', color: '#34d399', defaultOn: true },
  { id: 'analytics', label: 'Usage Analytics',  desc: 'Anonymous, opt-in product improvement',         icon: '📊', color: '#fbbf24', defaultOn: false },
];

/* ── Toggle switch ─────────────────────────────────────────────── */
function Toggle({ on, color, onChange }: { on: boolean; color: string; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className="cursor-pointer"
      style={{
        width: 42, height: 24, borderRadius: 99,
        background: on ? `${color}44` : 'rgba(255,255,255,0.08)',
        border: `1px solid ${on ? color + '66' : 'rgba(255,255,255,0.1)'}`,
        position: 'relative',
        flexShrink: 0,
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      <motion.div
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full"
        animate={{ x: on ? 20 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{ background: on ? color : 'rgba(255,255,255,0.3)', boxShadow: on ? `0 0 8px ${color}cc` : 'none' }}
      />
    </div>
  );
}

/* ── API Connection card (with live health status) ────────────── */
function APICard({ conn, liveStatus }: {
  conn: APIConnection;
  liveStatus?: { configured: boolean; authenticated?: boolean };
}) {
  const [expanded, setExpanded] = useState(false);

  const effectiveStatus: 'connected' | 'disconnected' | 'coming_soon' | 'configured' = (() => {
    if (conn.status === 'coming_soon') return 'coming_soon';
    if (!liveStatus) return conn.status;
    if (liveStatus.authenticated)     return 'connected';
    if (liveStatus.configured)        return 'configured';
    return 'disconnected';
  })();

  const statusMeta = {
    connected:    { label: 'Connected',    color: '#34d399' },
    disconnected: { label: 'Disconnected', color: 'var(--text-400)' },
    coming_soon:  { label: 'Phase 5',      color: '#a78bfa' },
    configured:   { label: 'Key Set ✓',    color: '#22d3ee' },
  }[effectiveStatus];

  const oauthUrl = conn.id === 'gcal'    ? '/api/auth/google/start'
    : conn.id === 'spotify' ? '/api/auth/spotify/start'
    : null;

  return (
    <motion.div variants={fadeUp}>
      <GlassPanel className="overflow-hidden">
        <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
            style={{ background: `${conn.color}14`, border: `1px solid ${conn.color}28` }}>
            {conn.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--text-100)' }}>{conn.name}</span>
              <MetricPill color={statusMeta.color} className="text-[10px]">{statusMeta.label}</MetricPill>
              {conn.serverSideOnly && <MetricPill color="#f59e0b" className="text-[10px]">🔒 Server-only</MetricPill>}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', marginTop: 2 }}>{conn.description}</p>
          </div>
          <motion.span style={{ color: 'var(--text-400)', fontSize: 12 }} animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>▾</motion.span>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
            >
              <Divider />
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-label mb-1">ENV VARIABLE</p>
                  <div className="px-3 py-2 rounded-lg env-var-pill"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: conn.color }}>
                    {conn.envVar}
                  </div>
                </div>
                <div>
                  <p className="text-label mb-1">USED FOR</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-300)', lineHeight: 1.6 }}>{conn.usedFor}</p>
                </div>
                <div className="flex gap-2 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
                  <span style={{ fontSize: 12 }}>⚠️</span>
                  <p style={{ fontSize: 'var(--text-xs)', color: '#fbbf24', lineHeight: 1.6 }}>{conn.privacyNote}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <motion.a
                    href={conn.docsUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center rounded-xl py-2 text-xs font-medium"
                    style={{ fontFamily: 'var(--font-display)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-300)', cursor: 'pointer', textDecoration: 'none' }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  >
                    📖 View Docs
                  </motion.a>

                  {oauthUrl && conn.status !== 'coming_soon' ? (
                    <motion.a
                      href={oauthUrl}
                      className="flex-1 text-center rounded-xl py-2 text-xs font-medium"
                      style={{
                        fontFamily: 'var(--font-display)',
                        background: effectiveStatus === 'connected' ? 'rgba(52,211,153,0.14)' : `${conn.color}1e`,
                        border: `1px solid ${effectiveStatus === 'connected' ? 'rgba(52,211,153,0.4)' : conn.color + '44'}`,
                        color: effectiveStatus === 'connected' ? '#34d399' : conn.color,
                        cursor: 'pointer', textDecoration: 'none',
                      }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    >
                      {effectiveStatus === 'connected' ? '✓ Reconnect' : '⚡ Connect via OAuth'}
                    </motion.a>
                  ) : (
                    <motion.button
                      className="flex-1 rounded-xl py-2 text-xs font-medium"
                      style={{
                        fontFamily: 'var(--font-display)',
                        background: conn.status === 'coming_soon' ? 'rgba(167,139,250,0.1)' : `${conn.color}1e`,
                        border: `1px solid ${conn.status === 'coming_soon' ? 'rgba(167,139,250,0.3)' : conn.color + '44'}`,
                        color: conn.status === 'coming_soon' ? '#a78bfa' : conn.color,
                        cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    >
                      {conn.status === 'coming_soon' ? '⏳ Phase 5'
                        : effectiveStatus === 'configured' ? '✔ Key Configured'
                        : effectiveStatus === 'connected'  ? '✓ Connected'
                        : '⚡ Connect'}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </motion.div>
  );
}

/* ── Settings row ─────────────────────────────────────────────── */
function SettingRow({ item, on, onToggle }: { item: typeof APPEARANCE_SETTINGS[0]; on: boolean; onToggle: () => void }) {
  return (
    <motion.div variants={fadeUp}>
      <GlassPanel>
        <div className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
            style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--text-100)' }}>{item.label}</span>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-400)', marginTop: 2 }}>{item.desc}</p>
          </div>
          <Toggle on={on} color={item.color} onChange={onToggle} />
        </div>
      </GlassPanel>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const initOn = new Set([...APPEARANCE_SETTINGS, ...PRIVACY_SETTINGS].filter(s => s.defaultOn).map(s => s.id));
  const [on, setOn]       = useState<Set<string>>(initOn);
  const [health, setHealth]       = useState<HealthResult | null>(null);
  const [healthLoading, setLoad]  = useState(true);

  const toggle = (id: string) => setOn(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  // Fetch live API health on mount
  useEffect(() => {
    getHealth()
      .then(h => { setHealth(h); setLoad(false); })
      .catch(() => setLoad(false));
  }, []);

  const getLiveStatus = (id: string) => {
    if (!health) return undefined;
    if (id === 'gemini')      return { configured: health.services.gemini === 'configured' };
    if (id === 'openweather') return { configured: health.services.openweather === 'configured' };
    if (id === 'gcal')        return { configured: health.services.googleCalendar.credentials === 'configured', authenticated: health.services.googleCalendar.authenticated };
    if (id === 'spotify')     return { configured: health.services.spotify.credentials === 'configured', authenticated: health.services.spotify.authenticated };
    return undefined;
  };

  const configuredCount = health ? [
    health.services.gemini === 'configured',
    health.services.openweather === 'configured',
    health.services.googleCalendar.credentials === 'configured',
    health.services.spotify.credentials === 'configured',
  ].filter(Boolean).length : 0;

  return (
    <AppShell>
      <div className="page-inner" style={{ maxWidth: 680 }}>
        <SectionHeader
          title="Settings"
          subtitle="Configure Orbit OS — connect real data sources and shape your experience."
        />

        <motion.div className="space-y-10" variants={staggerContainer} initial="hidden" animate="show">

          {/* ── API Connections ── */}
          <section>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-label">API CONNECTIONS</p>
              <div className="flex items-center gap-2">
                {healthLoading ? (
                  <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>Checking services…</span>
                ) : (
                  <MetricPill color={configuredCount > 0 ? '#34d399' : '#fbbf24'}>
                    {configuredCount}/4 configured
                  </MetricPill>
                )}
                <MetricPill color="#a78bfa">Phase 4 Ready</MetricPill>
              </div>
            </div>
            <motion.div className="space-y-2.5" variants={staggerContainer} initial="hidden" animate="show">
              {API_CONNECTIONS.map(conn => (
                <APICard key={conn.id} conn={conn} liveStatus={getLiveStatus(conn.id)} />
              ))}
            </motion.div>
          </section>

          {/* ── Appearance ── */}
          <section>
            <p className="text-label mb-4">APPEARANCE</p>
            <motion.div className="space-y-2" variants={staggerContainer} initial="hidden" animate="show">
              {APPEARANCE_SETTINGS.map(item => (
                <SettingRow key={item.id} item={item} on={on.has(item.id)} onToggle={() => toggle(item.id)} />
              ))}
            </motion.div>
          </section>

          {/* ── Privacy ── */}
          <section>
            <p className="text-label mb-4">PRIVACY</p>
            <motion.div className="space-y-2" variants={staggerContainer} initial="hidden" animate="show">
              {PRIVACY_SETTINGS.map(item => (
                <SettingRow key={item.id} item={item} on={on.has(item.id)} onToggle={() => toggle(item.id)} />
              ))}
            </motion.div>
          </section>

          {/* ── Security reminder ── */}
          <motion.div variants={fadeUp}>
            <GlassPanel className="p-5" style={{ border: '1px solid rgba(245,158,11,0.22)' }}>
              <div className="flex gap-3">
                <span style={{ fontSize: 20 }}>🔐</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: '#fbbf24', marginBottom: 6 }}>
                    Security Notice
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-300)', lineHeight: 1.7 }}>
                    Never commit real API keys to version control. Use{' '}
                    <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4, fontFamily:'var(--font-mono)', color:'#fbbf24' }}>.env.local</code>
                    {' '}for local development. Server-side secrets (Gemini, Spotify, Google) must never appear in{' '}
                    <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4, fontFamily:'var(--font-mono)', color:'#fbbf24' }}>NEXT_PUBLIC_</code>
                    {' '}variables.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

        </motion.div>

        <motion.p className="text-center mt-12"
          style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          Orbit OS · v0.4.0 · Phase 4 API Layer · {health ? `${configuredCount}/4 services configured` : 'checking services…'}
        </motion.p>
      </div>
    </AppShell>
  );
}
