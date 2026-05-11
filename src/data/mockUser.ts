import { UserProfile, MoodType } from '@/types';

export const userData: UserProfile = {
  id: 'user-1',
  name: 'Alex Nova',
  avatar: '',
  energyLevel: 72,
  currentMood: 'focused',
  timezone: 'Europe/Istanbul',
};

export const moodOptions: { value: MoodType; label: string; emoji: string; color: string }[] = [
  { value: 'focused',   label: 'Focused',   emoji: '🎯', color: '#7c3aed' },
  { value: 'energized', label: 'Energized', emoji: '⚡', color: '#059669' },
  { value: 'calm',      label: 'Calm',      emoji: '🌊', color: '#0891b2' },
  { value: 'creative',  label: 'Creative',  emoji: '✨', color: '#be185d' },
  { value: 'tired',     label: 'Tired',     emoji: '😴', color: '#475569' },
  { value: 'stressed',  label: 'Stressed',  emoji: '🌀', color: '#dc2626' },
];

export const weekDaysData = [
  { day: 'Mon', date: 5,  events: 4, energy: 58, mood: 'calm',      tasksCompleted: 3, totalTasks: 4  },
  { day: 'Tue', date: 6,  events: 6, energy: 84, mood: 'energized', tasksCompleted: 5, totalTasks: 6  },
  { day: 'Wed', date: 7,  events: 3, energy: 69, mood: 'focused',   tasksCompleted: 3, totalTasks: 3  },
  { day: 'Thu', date: 8,  events: 7, energy: 88, mood: 'focused',   tasksCompleted: 6, totalTasks: 7  },
  { day: 'Fri', date: 9,  events: 5, energy: 76, mood: 'creative',  tasksCompleted: 4, totalTasks: 5  },
  { day: 'Sat', date: 10, events: 2, energy: 43, mood: 'tired',     tasksCompleted: 1, totalTasks: 2  },
  { day: 'Sun', date: 11, events: 6, energy: 72, mood: 'focused',   tasksCompleted: 3, totalTasks: 6, active: true },
];

export const metricsData = {
  focusHoursToday: 4.5,
  focusHoursWeek: 22,
  tasksCompleted: 3,
  totalTasks: 6,
  streakDays: 8,
  energyAvgWeek: 71,
  habitCompletionRate: 67,
  deepWorkSessions: 3,
};
