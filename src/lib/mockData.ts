import {
  UserProfile, OrbitEvent, WeatherData, MusicTrack,
  AISignal, Habit, DailyBrief, FocusSession,
} from '@/types';

/* ─── User ───────────────────────────────────────────────────── */
export const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Alex Nova',
  avatar: '',
  energyLevel: 72,
  currentMood: 'focused',
  timezone: 'Europe/Istanbul',
};

/* ─── Events ─────────────────────────────────────────────────── */
export const mockEvents: OrbitEvent[] = [
  { id: 'evt-1', title: 'Deep Work Block', type: 'focus', startTime: '2026-05-11T09:00:00', endTime: '2026-05-11T11:00:00', importance: 3, urgency: 'high',   color: '#a78bfa', completed: true,  orbitIndex: 0 },
  { id: 'evt-2', title: 'Team Sync',        type: 'meeting', startTime: '2026-05-11T11:30:00', endTime: '2026-05-11T12:00:00', importance: 2, urgency: 'medium', color: '#22d3ee', completed: true,  orbitIndex: 1 },
  { id: 'evt-3', title: 'Lunch Break',      type: 'break',   startTime: '2026-05-11T12:00:00', endTime: '2026-05-11T13:00:00', importance: 1, urgency: 'low',    color: '#34d399', completed: true,  orbitIndex: 2 },
  { id: 'evt-4', title: 'Code Review',      type: 'task',    startTime: '2026-05-11T14:00:00', endTime: '2026-05-11T15:00:00', importance: 2, urgency: 'medium', color: '#fbbf24', completed: false, orbitIndex: 0 },
  { id: 'evt-5', title: 'Architecture Planning', type: 'task', startTime: '2026-05-11T15:30:00', endTime: '2026-05-11T17:30:00', importance: 3, urgency: 'high', color: '#f472b6', completed: false, orbitIndex: 1 },
  { id: 'evt-6', title: 'Evening Run',      type: 'habit',   startTime: '2026-05-11T18:30:00', endTime: '2026-05-11T19:30:00', importance: 2, urgency: 'low',    color: '#34d399', completed: false, orbitIndex: 2 },
];

/* ─── Weather ────────────────────────────────────────────────── */
export const mockWeather: WeatherData = {
  condition: 'Partly Cloudy', temperature: 19, feelsLike: 17, humidity: 65,
  icon: '⛅', city: 'Istanbul', localTime: '21:21',
};

/* ─── Music ──────────────────────────────────────────────────── */
export const mockMusic: MusicTrack = {
  title: 'Cornfield Chase', artist: 'Hans Zimmer', album: 'Interstellar OST',
  coverUrl: '', isPlaying: true, progress: 38, duration: 192,
};

/* ─── AI Signals ─────────────────────────────────────────────── */
export const mockSignals: AISignal[] = [
  {
    id: 'sig-1', type: 'insight', category: 'energy',
    title: 'Peak Focus Window Detected',
    body: 'Your energy patterns suggest a deep work window between 09:00–11:00. You completed your last 7 morning focus blocks with 94% task completion rate — your highest streak this month.',
    confidence: 91, timestamp: '2026-05-11T21:00:00', icon: '⚡',
  },
  {
    id: 'sig-2', type: 'recommendation', category: 'habits',
    title: 'Streak at Risk',
    body: 'Your evening run habit sits at a 12-day streak. You have roughly 2 hours before your typical time window closes. Current conditions: mild 17°C, low humidity — ideal for outdoor activity.',
    confidence: 87, timestamp: '2026-05-11T20:45:00', icon: '🔥',
  },
  {
    id: 'sig-3', type: 'pattern', category: 'mood',
    title: 'Music → Focus Correlation',
    body: 'When you listen to ambient instrumental music during focus sessions, your task completion rate increases by 23%. Hans Zimmer currently playing — this aligns with your top 10% productivity sessions.',
    confidence: 78, timestamp: '2026-05-11T20:30:00', icon: '🎵',
  },
  {
    id: 'sig-4', type: 'alert', category: 'focus',
    title: 'Architecture Planning Starting Soon',
    body: 'Your highest-impact task of the day begins in 30 minutes. Based on past sessions, activating Flow Mode and silencing notifications now yields a 41% improvement in session quality.',
    confidence: 100, timestamp: '2026-05-11T21:02:00', icon: '🌐',
  },
  {
    id: 'sig-5', type: 'insight', category: 'weather',
    title: 'Weather × Creativity Alignment',
    body: 'Partly cloudy evenings historically correlate with your most creative output sessions. Constellation data shows 3 of your 5 best creative sessions occurred on days with similar conditions.',
    confidence: 69, timestamp: '2026-05-11T19:00:00', icon: '⛅',
  },
  {
    id: 'sig-6', type: 'pattern', category: 'energy',
    title: 'Energy Recovery Pattern',
    body: 'Your 72% energy reading is above your Sunday average of 61%. The morning meditation streak (8 days) is statistically linked to your elevated afternoon energy — correlation: 0.84.',
    confidence: 83, timestamp: '2026-05-11T18:00:00', icon: '📊',
  },
];

/* ─── Habits ─────────────────────────────────────────────────── */
export const mockHabits: Habit[] = [
  { id: 'hab-1', name: 'Morning Meditation', category: 'focus',    streak: 8,  completedToday: true,  completionRate: 82, linkedEvents: ['evt-1'],        position: { x: 120, y: 80  } },
  { id: 'hab-2', name: 'Evening Run',        category: 'health',   streak: 12, completedToday: false, completionRate: 76, linkedEvents: ['evt-6'],        position: { x: 330, y: 60  } },
  { id: 'hab-3', name: 'Deep Work 2h+',      category: 'focus',    streak: 5,  completedToday: true,  completionRate: 91, linkedEvents: ['evt-1','evt-5'], position: { x: 220, y: 185 } },
  { id: 'hab-4', name: 'Reading 30 min',     category: 'learning', streak: 21, completedToday: true,  completionRate: 88, linkedEvents: [],               position: { x: 75,  y: 245 } },
  { id: 'hab-5', name: 'No-Screen Wind Down',category: 'health',   streak: 3,  completedToday: false, completionRate: 54, linkedEvents: [],               position: { x: 385, y: 210 } },
  { id: 'hab-6', name: 'Creative Journaling',category: 'creative', streak: 7,  completedToday: true,  completionRate: 71, linkedEvents: [],               position: { x: 260, y: 305 } },
  { id: 'hab-7', name: 'Cold Shower',        category: 'health',   streak: 4,  completedToday: true,  completionRate: 63, linkedEvents: [],               position: { x: 155, y: 295 } },
];

/* ─── Daily Brief ────────────────────────────────────────────── */
export const mockDailyBrief: DailyBrief = {
  greeting: 'Good evening, Alex.',
  summary: "You've had a strong day. Two deep work sessions completed, team sync done. Your energy held above 70% since morning — statistically linked to your meditation streak.",
  energyForecast: 'Energy expected to dip slightly over the next 2 hours. A short walk or breathing exercise now could extend your productive window into the evening.',
  topPriority: 'Architecture Planning — starts in 30 minutes. Your highest-impact task of the day.',
  weatherNote: 'Istanbul cooling to 17°C tonight — historically your best creative temperature range.',
  musicMood: 'Ambient instrumental detected — correlates with your top 23% focus sessions.',
};

/* ─── Focus Session ──────────────────────────────────────────── */
export const mockFocusSession: FocusSession = {
  isActive: false, mode: 'pomodoro', duration: 25, elapsed: 0, sessionsCompleted: 3,
};

/* ─── Week Summary ───────────────────────────────────────────── */
export const mockWeekDays = [
  { day: 'Mon', date: 5,  events: 4, energy: 58, mood: 'calm',      tasksCompleted: 3, totalTasks: 4  },
  { day: 'Tue', date: 6,  events: 6, energy: 84, mood: 'energized', tasksCompleted: 5, totalTasks: 6  },
  { day: 'Wed', date: 7,  events: 3, energy: 69, mood: 'focused',   tasksCompleted: 3, totalTasks: 3  },
  { day: 'Thu', date: 8,  events: 7, energy: 88, mood: 'focused',   tasksCompleted: 6, totalTasks: 7  },
  { day: 'Fri', date: 9,  events: 5, energy: 76, mood: 'creative',  tasksCompleted: 4, totalTasks: 5  },
  { day: 'Sat', date: 10, events: 2, energy: 43, mood: 'tired',     tasksCompleted: 1, totalTasks: 2  },
  { day: 'Sun', date: 11, events: 6, energy: 72, mood: 'focused',   tasksCompleted: 3, totalTasks: 6, active: true },
];

/* ─── Productivity Metrics ───────────────────────────────────── */
export const mockMetrics = {
  focusHoursToday: 4.5,
  focusHoursWeek: 22,
  tasksCompleted: 3,
  totalTasks: 6,
  streakDays: 8,
  energyAvgWeek: 71,
  habitCompletionRate: 67,
  deepWorkSessions: 3,
};
