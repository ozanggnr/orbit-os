import { OrbitEvent } from '@/types';

export const eventsData: OrbitEvent[] = [
  { id: 'evt-1', title: 'Deep Work Block',        type: 'focus',   startTime: '2026-05-11T09:00:00', endTime: '2026-05-11T11:00:00', importance: 3, urgency: 'high',   color: '#a78bfa', completed: true,  orbitIndex: 0 },
  { id: 'evt-2', title: 'Team Sync',               type: 'meeting', startTime: '2026-05-11T11:30:00', endTime: '2026-05-11T12:00:00', importance: 2, urgency: 'medium', color: '#22d3ee', completed: true,  orbitIndex: 1 },
  { id: 'evt-3', title: 'Lunch Break',             type: 'break',   startTime: '2026-05-11T12:00:00', endTime: '2026-05-11T13:00:00', importance: 1, urgency: 'low',    color: '#34d399', completed: true,  orbitIndex: 2 },
  { id: 'evt-4', title: 'Code Review',             type: 'task',    startTime: '2026-05-11T14:00:00', endTime: '2026-05-11T15:00:00', importance: 2, urgency: 'medium', color: '#fbbf24', completed: false, orbitIndex: 0 },
  { id: 'evt-5', title: 'Architecture Planning',   type: 'task',    startTime: '2026-05-11T15:30:00', endTime: '2026-05-11T17:30:00', importance: 3, urgency: 'high',   color: '#f472b6', completed: false, orbitIndex: 1 },
  { id: 'evt-6', title: 'Evening Run',             type: 'habit',   startTime: '2026-05-11T18:30:00', endTime: '2026-05-11T19:30:00', importance: 2, urgency: 'low',    color: '#34d399', completed: false, orbitIndex: 2 },
];

export const weekEvents: Record<string, OrbitEvent[]> = {
  Mon: [
    { id: 'w-mon-1', title: 'Morning Stand-up',    type: 'meeting', startTime: '2026-05-05T09:30:00', endTime: '2026-05-05T09:45:00', importance: 1, urgency: 'low',    color: '#22d3ee', completed: true,  orbitIndex: 0 },
    { id: 'w-mon-2', title: 'Feature Development', type: 'focus',   startTime: '2026-05-05T10:00:00', endTime: '2026-05-05T12:00:00', importance: 3, urgency: 'high',   color: '#a78bfa', completed: true,  orbitIndex: 1 },
    { id: 'w-mon-3', title: 'Bug Triage',          type: 'task',    startTime: '2026-05-05T14:00:00', endTime: '2026-05-05T15:30:00', importance: 2, urgency: 'medium', color: '#fbbf24', completed: true,  orbitIndex: 0 },
    { id: 'w-mon-4', title: 'Evening Read',        type: 'habit',   startTime: '2026-05-05T21:00:00', endTime: '2026-05-05T21:30:00', importance: 1, urgency: 'low',    color: '#34d399', completed: false, orbitIndex: 2 },
  ],
  Fri: [
    { id: 'w-fri-1', title: 'Weekly Review',       type: 'focus',   startTime: '2026-05-09T09:00:00', endTime: '2026-05-09T10:30:00', importance: 3, urgency: 'high',   color: '#a78bfa', completed: true,  orbitIndex: 0 },
    { id: 'w-fri-2', title: 'Retrospective',       type: 'meeting', startTime: '2026-05-09T14:00:00', endTime: '2026-05-09T15:00:00', importance: 2, urgency: 'medium', color: '#22d3ee', completed: true,  orbitIndex: 1 },
    { id: 'w-fri-3', title: 'Planning Session',    type: 'task',    startTime: '2026-05-09T15:30:00', endTime: '2026-05-09T17:00:00', importance: 2, urgency: 'medium', color: '#f472b6', completed: true,  orbitIndex: 0 },
    { id: 'w-fri-4', title: 'Gym',                 type: 'habit',   startTime: '2026-05-09T18:30:00', endTime: '2026-05-09T20:00:00', importance: 2, urgency: 'low',    color: '#34d399', completed: true,  orbitIndex: 2 },
    { id: 'w-fri-5', title: 'Side Project Work',   type: 'focus',   startTime: '2026-05-09T21:00:00', endTime: '2026-05-09T23:00:00', importance: 2, urgency: 'low',    color: '#a78bfa', completed: false, orbitIndex: 1 },
  ],
};
