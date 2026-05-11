export interface ConstellationNode {
  id: string;
  label: string;
  description: string;
  category: 'music' | 'focus' | 'weather' | 'mood' | 'sleep' | 'calendar' | 'health';
  color: string;
  x: number;
  y: number;
  strength: number; // 0–100 correlation strength
}

export interface ConstellationEdge {
  from: string;
  to: string;
  correlation: number; // -1 to 1
  label: string;
}

export interface CorrelationPattern {
  id: string;
  title: string;
  description: string;
  strength: number;
  impact: 'positive' | 'negative' | 'neutral';
  category: string;
  dataPoints: number;
  icon: string;
  insight: string;
}

export const constellationNodes: ConstellationNode[] = [
  { id: 'music',    label: 'Music',        description: 'Ambient & instrumental sessions', category: 'music',    color: '#a78bfa', x: 160, y: 100, strength: 85 },
  { id: 'focus',    label: 'Focus',        description: 'Deep work & flow states',          category: 'focus',    color: '#22d3ee', x: 310, y: 80,  strength: 92 },
  { id: 'weather',  label: 'Weather',      description: 'Local environmental conditions',   category: 'weather',  color: '#fbbf24', x: 440, y: 140, strength: 63 },
  { id: 'mood',     label: 'Mood',         description: 'Daily emotional state',            category: 'mood',     color: '#f472b6', x: 260, y: 220, strength: 78 },
  { id: 'sleep',    label: 'Sleep',        description: 'Rest quality & duration',          category: 'sleep',    color: '#34d399', x: 100, y: 240, strength: 88 },
  { id: 'calendar', label: 'Schedule',     description: 'Meeting density & load',           category: 'calendar', color: '#22d3ee', x: 400, y: 270, strength: 71 },
  { id: 'energy',   label: 'Energy',       description: 'Overall energy score',             category: 'health',   color: '#34d399', x: 180, y: 320, strength: 81 },
  { id: 'coding',   label: 'Late Coding',  description: 'After-hours development sessions', category: 'focus',    color: '#f59e0b', x: 350, y: 340, strength: 55 },
];

export const constellationEdges: ConstellationEdge[] = [
  { from: 'music',    to: 'focus',    correlation:  0.79, label: '+23% task completion' },
  { from: 'weather',  to: 'mood',     correlation:  0.61, label: 'mood follows weather' },
  { from: 'sleep',    to: 'energy',   correlation:  0.88, label: 'strong predictor' },
  { from: 'calendar', to: 'energy',   correlation: -0.62, label: 'dense days drain energy' },
  { from: 'coding',   to: 'sleep',    correlation: -0.71, label: 'delays sleep by 1.8h' },
  { from: 'mood',     to: 'focus',    correlation:  0.73, label: 'mood amplifies focus' },
  { from: 'energy',   to: 'focus',    correlation:  0.82, label: 'energy enables flow' },
];

export const correlationPatterns: CorrelationPattern[] = [
  {
    id: 'pat-1', title: 'Music + Focus', strength: 79, impact: 'positive',
    category: 'productivity', dataPoints: 34, icon: '🎵',
    description: 'Ambient instrumental music strongly correlates with deeper focus sessions.',
    insight: 'On days you listen to Hans Zimmer or Ólafur Arnalds during work, your average focus session lasts 47 minutes vs. 28 minutes on silent days.',
  },
  {
    id: 'pat-2', title: 'Weather + Mood', strength: 61, impact: 'positive',
    category: 'wellbeing', dataPoints: 28, icon: '⛅',
    description: 'Overcast days with mild temperature align with your most creative periods.',
    insight: '3 of your 5 highest-output creative sessions occurred on partly cloudy evenings between 17–19°C — exactly like tonight.',
  },
  {
    id: 'pat-3', title: 'Sleep + Productivity', strength: 88, impact: 'positive',
    category: 'health', dataPoints: 45, icon: '😴',
    description: 'Sleep quality is your strongest single predictor of next-day task completion.',
    insight: 'When you sleep 7.5h+ you complete an average of 84% of planned tasks. Below 6h, this drops to 51%.',
  },
  {
    id: 'pat-4', title: 'Calendar Density + Energy', strength: 62, impact: 'negative',
    category: 'schedule', dataPoints: 32, icon: '📅',
    description: 'Days with 5+ meetings correlate with 28% lower energy readings by 4 PM.',
    insight: 'Your 3 lowest-energy weeks all coincided with sprint planning periods. Consider batching meetings to Tue/Wed.',
  },
  {
    id: 'pat-5', title: 'Late Coding + Next-Day Fatigue', strength: 71, impact: 'negative',
    category: 'health', dataPoints: 19, icon: '🌙',
    description: 'Evening coding sessions after 23:00 delay sleep onset and reduce next-morning energy.',
    insight: 'On the 19 occasions you coded past midnight, the next-morning energy score averaged 41% vs. your typical 68%.',
  },
];
