export const MOOD_COLORS = {
  focused:   { core: '#7c3aed', glow: '#a78bfa', text: 'Focused' },
  calm:      { core: '#0891b2', glow: '#22d3ee', text: 'Calm' },
  energized: { core: '#059669', glow: '#34d399', text: 'Energized' },
  tired:     { core: '#475569', glow: '#64748b', text: 'Tired' },
  creative:  { core: '#be185d', glow: '#f472b6', text: 'Creative' },
  stressed:  { core: '#dc2626', glow: '#f87171', text: 'Stressed' },
} as const;

export const ORBIT_RADII = [230, 340, 460] as const;

export const EVENT_TYPE_ICONS: Record<string, string> = {
  task: '◆', meeting: '◉', focus: '◈', break: '◎', habit: '◍',
};

export const NAV_ITEMS = [
  { id: 'orbit',          label: 'Orbit',          icon: 'orbit',          href: '/orbit' },
  { id: 'timeline',       label: 'Timeline',       icon: 'timeline',       href: '/timeline' },
  { id: 'signals',        label: 'Signals',        icon: 'signals',        href: '/signals' },
  { id: 'constellations', label: 'Constellations', icon: 'constellations', href: '/constellations' },
  { id: 'settings',       label: 'Settings',       icon: 'settings',       href: '/settings' },
] as const;

export const SIGNAL_CATEGORY_COLORS: Record<string, string> = {
  energy:  '#fbbf24',
  habits:  '#34d399',
  focus:   '#a78bfa',
  mood:    '#f472b6',
  weather: '#22d3ee',
  music:   '#8b5cf6',
};

export const HABIT_CATEGORY_COLORS: Record<string, string> = {
  health:   '#34d399',
  focus:    '#a78bfa',
  social:   '#22d3ee',
  creative: '#f472b6',
  learning: '#fbbf24',
};
