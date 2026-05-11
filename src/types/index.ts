export type MoodType = 'focused' | 'calm' | 'energized' | 'tired' | 'creative' | 'stressed';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  energyLevel: number;
  currentMood: MoodType;
  timezone: string;
}

export interface OrbitEvent {
  id: string;
  title: string;
  type: 'task' | 'meeting' | 'focus' | 'break' | 'habit';
  startTime: string;
  endTime: string;
  importance: 1 | 2 | 3;
  urgency: 'low' | 'medium' | 'high';
  color: string;
  completed: boolean;
  orbitIndex: number;
  notes?: string;
}

export interface WeatherData {
  condition: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  icon: string;
  city: string;
  localTime: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
}

export interface AISignal {
  id: string;
  type: 'insight' | 'recommendation' | 'pattern' | 'alert';
  category: 'energy' | 'habits' | 'focus' | 'mood' | 'weather' | 'music';
  title: string;
  body: string;
  confidence: number;
  timestamp: string;
  icon: string;
  /** Interactive state — managed in UI */
  pinned?: boolean;
  read?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface Habit {
  id: string;
  name: string;
  category: 'health' | 'focus' | 'social' | 'creative' | 'learning';
  streak: number;
  completedToday: boolean;
  completionRate: number;
  linkedEvents: string[];
  position: { x: number; y: number };
}

export interface DailyBrief {
  greeting: string;
  summary: string;
  energyForecast: string;
  topPriority: string;
  weatherNote: string;
  musicMood: string;
}

export interface FocusSession {
  isActive: boolean;
  mode: 'pomodoro' | 'deep' | 'flow';
  duration: number;    // minutes
  elapsed: number;     // seconds
  sessionsCompleted: number;
}

export interface WeekDay {
  day: string;
  date: number;
  events: number;
  energy: number;
  mood: string;
  tasksCompleted: number;
  totalTasks: number;
  active?: boolean;
}

export interface ProductivityMetrics {
  focusHoursToday: number;
  focusHoursWeek: number;
  tasksCompleted: number;
  totalTasks: number;
  streakDays: number;
  energyAvgWeek: number;
  habitCompletionRate: number;
  deepWorkSessions: number;
}

/** Quick action definition for the orbit dashboard */
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

/** API connection card for settings page */
export interface APIConnection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  envVar: string;
  docsUrl: string;
  status: 'disconnected' | 'connected' | 'coming_soon';
  serverSideOnly: boolean;
  usedFor: string;
  privacyNote: string;
}

export type SignalFilterType = 'all' | 'insight' | 'recommendation' | 'pattern' | 'alert' | 'pinned';
export type TimelineView = 'today' | 'week' | 'month';

/** A single entry in the daily timeline */
export interface TimelineEntry {
  id: string;
  time: string;
  title: string;
  type: 'task' | 'meeting' | 'focus' | 'break' | 'habit' | 'insight';
  description: string;
  duration?: string;
  completed: boolean;
  highlight?: boolean;
  tags?: string[];
}

