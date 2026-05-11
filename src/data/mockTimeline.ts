export interface TimelineEntry {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'focus' | 'meeting' | 'task' | 'habit' | 'insight' | 'break';
  color: string;
  duration?: string;
  completed: boolean;
  highlight?: boolean;
  tags?: string[];
}

export interface MonthSummary {
  week: number;
  label: string;
  focusHours: number;
  tasksCompleted: number;
  avgEnergy: number;
  highlight: string;
}

export const todayTimeline: TimelineEntry[] = [
  {
    id: 'tl-1', time: '08:15', title: 'Morning Meditation',
    description: 'Started the day with 15 minutes of mindfulness. Energy baseline set at 68%.',
    type: 'habit', color: '#a78bfa', duration: '15 min', completed: true, tags: ['health', 'routine'],
  },
  {
    id: 'tl-2', time: '09:00', title: 'Deep Work Block — Orbit OS Architecture',
    description: 'Designed the data layer, component hierarchy, and API integration strategy. Entered deep flow state after ~12 minutes.',
    type: 'focus', color: '#a78bfa', duration: '2h', completed: true, highlight: true, tags: ['coding', 'architecture'],
  },
  {
    id: 'tl-3', time: '10:47', title: 'AI Insight Generated',
    description: 'Orbit OS detected peak focus: 94% task velocity, flow state maintained for 107 minutes — a personal record.',
    type: 'insight', color: '#22d3ee', completed: true,
  },
  {
    id: 'tl-4', time: '11:30', title: 'Team Sync',
    description: 'Sprint velocity review. Discussed upcoming milestone. Action items: finalize API schema, review PRs.',
    type: 'meeting', color: '#22d3ee', duration: '30 min', completed: true, tags: ['team', 'planning'],
  },
  {
    id: 'tl-5', time: '12:00', title: 'Lunch Break',
    description: 'Stepped away from screens. Short walk around the block, then a proper meal.',
    type: 'break', color: '#34d399', duration: '1h', completed: true,
  },
  {
    id: 'tl-6', time: '14:00', title: 'Code Review — Auth Service',
    description: 'Reviewed 4 pull requests. Left detailed comments on token refresh logic and rate limiting strategy.',
    type: 'task', color: '#fbbf24', duration: '1h', completed: false, tags: ['backend', 'security'],
  },
  {
    id: 'tl-7', time: '15:30', title: 'Architecture Planning Session',
    description: 'Mapped out Phase 3 of Orbit OS — interactive prototyping and mock AI integration.',
    type: 'focus', color: '#f472b6', duration: '2h', completed: false, highlight: true, tags: ['planning', 'high-impact'],
  },
  {
    id: 'tl-8', time: '18:30', title: 'Evening Run',
    description: 'Target: 5km run in the park. 12-day streak at risk — conditions are ideal (17°C, light wind).',
    type: 'habit', color: '#34d399', duration: '1h', completed: false, tags: ['health', 'streak'],
  },
];

export const weekRecap = `This has been one of your strongest weeks of the month. You maintained deep focus for an average of 4.2 hours per day — 31% above your monthly baseline. The architecture planning sessions showed exceptional output quality, and your morning meditation streak is now at 8 days, directly correlated with elevated afternoon energy levels.`;

export const monthSummaries: MonthSummary[] = [
  { week: 1, label: 'Apr 28 – May 4',  focusHours: 18, tasksCompleted: 22, avgEnergy: 64, highlight: 'Sprint kickoff week — high planning load' },
  { week: 2, label: 'May 5 – May 11',  focusHours: 22, tasksCompleted: 26, avgEnergy: 71, highlight: 'Peak week — architecture deep work' },
];
