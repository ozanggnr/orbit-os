'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import { GlassPanel, MetricPill, SectionHeader, ProgressBar, Divider, staggerContainer, fadeUp, scaleIn } from '@/components/ui/primitives';
import { mockHabits } from '@/lib/mockData';
import { HABIT_CATEGORY_COLORS } from '@/lib/constants';
import { constellationNodes, constellationEdges, correlationPatterns, ConstellationNode, CorrelationPattern } from '@/data/mockConstellations';
import { Habit } from '@/types';

const HABIT_POSITIONS = [
  { x: 118, y: 78 }, { x: 328, y: 58 }, { x: 218, y: 182 },
  { x: 72, y: 242 }, { x: 382, y: 208 }, { x: 258, y: 304 }, { x: 152, y: 294 },
];
const HABIT_CONNECTIONS = [[0,2],[1,2],[2,3],[2,5],[1,4],[0,6],[6,3]];

/* ── Correlation detail panel ─────────────────────────────────── */
function CorrelationDetail({ pattern, onClose }: { pattern: CorrelationPattern; onClose: () => void }) {
  const impactColor = pattern.impact === 'positive' ? '#34d399' : pattern.impact === 'negative' ? '#f87171' : '#22d3ee';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
    >
      <GlassPanel className="p-5" style={{ borderLeft: `3px solid ${impactColor}` }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 20 }}>{pattern.icon}</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--text-100)' }}>
                {pattern.title}
              </h3>
              <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                {pattern.dataPoints} data points · {pattern.category}
              </p>
            </div>
          </div>
          <motion.button
            style={{ color: 'var(--text-400)', cursor: 'pointer', fontSize: 16, background: 'none', border: 'none', lineHeight: 1 }}
            whileHover={{ color: 'var(--text-100)' }}
            onClick={onClose}
          >
            ✕
          </motion.button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div style={{ flex: 1 }}>
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)' }}>Correlation strength</span>
              <span style={{ fontSize: 10, color: impactColor, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{pattern.strength}%</span>
            </div>
            <ProgressBar value={pattern.strength} color={impactColor} height={3} />
          </div>
          <MetricPill color={impactColor}>{pattern.impact}</MetricPill>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.65, color: 'var(--text-300)', marginBottom: 12 }}>
          {pattern.description}
        </p>
        <Divider className="mb-3" />
        <p style={{ fontSize: 'var(--text-xs)', lineHeight: 1.7, color: 'var(--text-200)', fontStyle: 'italic' }}>
          "{pattern.insight}"
        </p>
      </GlassPanel>
    </motion.div>
  );
}

/* ── Node detail for constellation map nodes ──────────────────── */
function NodeDetail({ node, onClose }: { node: ConstellationNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      <GlassPanel className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-100)' }}>{node.label}</span>
          </div>
          <button style={{ color: 'var(--text-400)', cursor: 'pointer', background: 'none', border: 'none', fontSize: 14 }} onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-300)', marginBottom: 10 }}>{node.description}</p>
        <div className="flex items-center justify-between">
          <MetricPill color={node.color}>{node.category}</MetricPill>
          <div style={{ flex: 1, marginLeft: 12 }}>
            <ProgressBar value={node.strength} color={node.color} height={2} />
          </div>
          <span style={{ fontSize: 10, color: node.color, fontFamily: 'var(--font-mono)', marginLeft: 8 }}>{node.strength}%</span>
        </div>
        {/* Find connected edges */}
        <div className="mt-3 space-y-1">
          {constellationEdges.filter(e => e.from === node.id || e.to === node.id).map((edge, i) => {
            const other = constellationNodes.find(n => n.id === (edge.from === node.id ? edge.to : edge.from));
            if (!other) return null;
            const corr = edge.correlation;
            const c = corr > 0 ? '#34d399' : '#f87171';
            return (
              <div key={i} className="flex items-center gap-2">
                <span style={{ fontSize: 10, color: c, fontFamily: 'var(--font-mono)' }}>{corr > 0 ? '↑' : '↓'} {Math.abs(corr * 100).toFixed(0)}%</span>
                <span style={{ fontSize: 10, color: 'var(--text-400)' }}>with <strong style={{ color: other.color }}>{other.label}</strong> — {edge.label}</span>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </motion.div>
  );
}

/* ── Habit star (existing habit map) ──────────────────────────── */
function HabitStar({ h, pos, idx, selected, onSelect }: {
  h: Habit; pos: { x: number; y: number }; idx: number; selected: boolean; onSelect: () => void;
}) {
  const col = HABIT_CATEGORY_COLORS[h.category];
  const r   = 7 + h.completionRate / 15;

  return (
    <g className="constellation-dot" onClick={onSelect} style={{ cursor: 'pointer' }}>
      <motion.circle cx={pos.x} cy={pos.y} r={r + 9} fill={col} fillOpacity={selected ? 0.15 : 0.06}
        animate={{ r: [r+5, r+14, r+5] }} transition={{ duration: 2.5 + idx * 0.3, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.circle cx={pos.x} cy={pos.y} r={selected ? r + 2 : r}
        fill={col} fillOpacity={h.completedToday ? 1 : 0.38}
        initial={{ r: 0, opacity: 0 }} animate={{ r: selected ? r + 2 : r, opacity: 1 }}
        transition={{ delay: 0.4 + idx * 0.08, duration: 0.5 }}
        style={{ filter: `drop-shadow(0 0 ${selected ? 12 : h.completedToday ? 7 : 2}px ${col})` }}
      />
      {selected && (
        <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" stroke={col} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      )}
      {h.streak > 0 && (
        <text x={pos.x + r + 4} y={pos.y - r + 4} fill={col} fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">{h.streak}d</text>
      )}
      <text x={pos.x} y={pos.y + r + 17} textAnchor="middle" fill={selected ? 'rgba(248,250,252,0.85)' : 'rgba(248,250,252,0.45)'} fontSize="10" fontFamily="var(--font-display)">
        {h.name}
      </text>
    </g>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ConstellationsPage() {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'habits' | 'correlations'>('habits');

  const doneCount  = mockHabits.filter(h => h.completedToday).length;
  const activePattern = correlationPatterns.find(p => p.id === selectedPattern);
  const activeNode    = constellationNodes.find(n => n.id === selectedNode);
  const activeHabit   = mockHabits.find(h => h.id === selectedHabit);
  const habitColor    = activeHabit ? HABIT_CATEGORY_COLORS[activeHabit.category] : null;

  return (
    <AppShell>
      <div className="page-inner">
        <SectionHeader
          title="Constellations"
          subtitle="Your habits, data patterns, and life correlations as a living star chart."
          right={<MetricPill color="#fbbf24" dot>⭐ {doneCount}/{mockHabits.length} today</MetricPill>}
        />

        {/* Map mode toggle */}
        <motion.div className="flex gap-2 mb-6" variants={fadeUp} initial="hidden" animate="show">
          {[{id: 'habits', label: '★ Habit Map'}, {id: 'correlations', label: '⟳ Data Correlations'}].map(m => (
            <motion.button
              key={m.id}
              className="px-4 py-2 rounded-xl text-xs font-medium"
              style={{
                fontFamily: 'var(--font-display)',
                background: mapMode === m.id ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${mapMode === m.id ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: mapMode === m.id ? '#a78bfa' : 'var(--text-400)',
                cursor: 'pointer',
                boxShadow: mapMode === m.id ? '0 0 16px rgba(167,139,250,0.2)' : 'none',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMapMode(m.id as any); setSelectedHabit(null); setSelectedNode(null); setSelectedPattern(null); }}
            >
              {m.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* ── Main map area ── */}
          <div className="xl:col-span-3">
            <AnimatePresence mode="wait">

              {/* HABIT MAP */}
              {mapMode === 'habits' && (
                <motion.div key="habits" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <GlassPanel className="p-4 sm:p-6">
                    <p className="text-label mb-2">HABIT CONSTELLATION — CLICK A STAR</p>
                    <div className="constellation-svg-wrap">
                    <svg viewBox="0 0 500 380" className="w-full" style={{ maxHeight: 380 }}>
                      {/* Grid dots */}
                      {Array.from({ length: 12 }).map((_, r) =>
                        Array.from({ length: 16 }).map((_, c) => (
                          <circle key={`${r}-${c}`} cx={c * 33 + 9} cy={r * 33 + 9} r={0.7} fill="rgba(255,255,255,0.04)" />
                        ))
                      )}
                      {/* Connection lines */}
                      {HABIT_CONNECTIONS.map(([a, b], i) => (
                        <motion.line key={i}
                          x1={HABIT_POSITIONS[a]?.x ?? 0} y1={HABIT_POSITIONS[a]?.y ?? 0}
                          x2={HABIT_POSITIONS[b]?.x ?? 0} y2={HABIT_POSITIONS[b]?.y ?? 0}
                          stroke={selectedHabit && (mockHabits[a]?.id === selectedHabit || mockHabits[b]?.id === selectedHabit) ? 'rgba(167,139,250,0.6)' : 'rgba(167,139,250,0.22)'}
                          strokeWidth={selectedHabit && (mockHabits[a]?.id === selectedHabit || mockHabits[b]?.id === selectedHabit) ? 1.5 : 1}
                          strokeDasharray="4 5"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
                        />
                      ))}
                      {/* Stars */}
                      {mockHabits.map((h, i) => (
                        <HabitStar key={h.id} h={h} pos={HABIT_POSITIONS[i] ?? { x:50, y:50 }} idx={i}
                          selected={selectedHabit === h.id}
                          onSelect={() => setSelectedHabit(id => id === h.id ? null : h.id)}
                        />
                      ))}
                    </svg>
                    </div>
                  </GlassPanel>

                  {/* Selected habit detail */}
                  <AnimatePresence>
                    {activeHabit && (
                      <motion.div className="mt-3" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}>
                        <GlassPanel className="p-4" style={{ borderLeft: `3px solid ${habitColor}` }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: habitColor ?? '#a78bfa', boxShadow: `0 0 6px ${habitColor}` }} />
                              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-100)' }}>{activeHabit.name}</span>
                            </div>
                            <button style={{ color: 'var(--text-400)', cursor: 'pointer', background: 'none', border: 'none' }} onClick={() => setSelectedHabit(null)}>✕</button>
                          </div>
                          <div className="flex gap-2 flex-wrap mb-3">
                            <MetricPill color={habitColor ?? '#a78bfa'}>{activeHabit.category}</MetricPill>
                            <MetricPill color="#fbbf24">🔥 {activeHabit.streak}-day streak</MetricPill>
                            {activeHabit.completedToday ? <MetricPill color="#34d399">✓ Done today</MetricPill> : <MetricPill color="#f59e0b">○ Not yet today</MetricPill>}
                          </div>
                          <ProgressBar value={activeHabit.completionRate} color={habitColor ?? '#a78bfa'} height={3} />
                          <p style={{ fontSize: 10, color: 'var(--text-400)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
                            {activeHabit.completionRate}% completion over last 30 days
                          </p>
                        </GlassPanel>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* CORRELATION MAP */}
              {mapMode === 'correlations' && (
                <motion.div key="correlations" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <GlassPanel className="p-4 sm:p-6">
                    <p className="text-label mb-2">DATA CORRELATION MAP — CLICK A NODE</p>
                    <div className="constellation-svg-wrap">
                    <svg viewBox="0 0 500 380" className="w-full" style={{ maxHeight: 380 }}>
                      {Array.from({ length: 12 }).map((_, r) =>
                        Array.from({ length: 16 }).map((_, c) => (
                          <circle key={`${r}-${c}`} cx={c * 33 + 9} cy={r * 33 + 9} r={0.7} fill="rgba(255,255,255,0.04)" />
                        ))
                      )}
                      {/* Edges */}
                      {constellationEdges.map((edge, i) => {
                        const from = constellationNodes.find(n => n.id === edge.from);
                        const to   = constellationNodes.find(n => n.id === edge.to);
                        if (!from || !to) return null;
                        const highlighted = selectedNode === edge.from || selectedNode === edge.to;
                        const c = edge.correlation > 0 ? '#34d399' : '#f87171';
                        return (
                          <g key={i}>
                            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                              stroke={highlighted ? c : 'rgba(255,255,255,0.1)'}
                              strokeWidth={highlighted ? 1.5 : 1}
                              strokeDasharray={edge.correlation < 0 ? '4 4' : undefined}
                            />
                            {/* Edge label mid-point */}
                            {highlighted && (
                              <text
                                x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6}
                                textAnchor="middle" fill={c} fontSize="8" fontFamily="var(--font-mono)"
                              >
                                {edge.label}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      {/* Nodes */}
                      {constellationNodes.map((node, i) => {
                        const r = 8 + node.strength / 12;
                        const selected = selectedNode === node.id;
                        return (
                          <g key={node.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedNode(id => id === node.id ? null : node.id)}>
                            <motion.circle cx={node.x} cy={node.y} r={r + 8} fill={node.color} fillOpacity={selected ? 0.12 : 0.05}
                              animate={{ r: [r+5, r+12, r+5] }} transition={{ duration: 2+i*0.2, repeat: Infinity, ease: 'easeInOut' }} />
                            <motion.circle cx={node.x} cy={node.y} r={selected ? r+2 : r}
                              fill={node.color} fillOpacity={selected ? 1 : 0.75}
                              style={{ filter: `drop-shadow(0 0 ${selected?12:5}px ${node.color})` }}
                              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4+i*0.06 }}
                            />
                            {selected && <circle cx={node.x} cy={node.y} r={r+5} fill="none" stroke={node.color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />}
                            <text x={node.x} y={node.y + r + 16} textAnchor="middle"
                              fill={selected ? 'rgba(248,250,252,0.9)' : 'rgba(248,250,252,0.45)'}
                              fontSize="10" fontFamily="var(--font-display)"
                            >
                              {node.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                    </div>
                  </GlassPanel>

                  {/* Selected node detail */}
                  <AnimatePresence>
                    {activeNode && (
                      <motion.div className="mt-3" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}>
                        <NodeDetail node={activeNode} onClose={() => setSelectedNode(null)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right panel ── */}
          <div className="xl:col-span-2">
            <AnimatePresence mode="wait">
              {mapMode === 'habits' ? (
                <motion.div key="habits-list" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>
                  <p className="text-label mb-4">HABITS</p>
                  <motion.div className="space-y-2.5" variants={staggerContainer} initial="hidden" animate="show">
                    {mockHabits.map((h, i) => {
                      const col = HABIT_CATEGORY_COLORS[h.category];
                      const sel = selectedHabit === h.id;
                      return (
                        <motion.div key={h.id} variants={fadeUp}>
                          <GlassPanel className="p-4 cursor-pointer" hover
                            onClick={() => setSelectedHabit(id => id === h.id ? null : h.id)}
                            style={{ borderLeft: sel ? `3px solid ${col}` : '3px solid transparent' }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <motion.div className="w-3 h-3 rounded-full shrink-0"
                                style={{ background: h.completedToday ? col : 'transparent', border: `2px solid ${col}`,
                                  boxShadow: h.completedToday ? `0 0 8px ${col}99` : 'none' }}
                                animate={h.completedToday ? { scale:[1,1.15,1] } : {}}
                                transition={{ duration: 2.5, repeat: Infinity }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span style={{ fontFamily:'var(--font-display)', fontWeight:500, fontSize:'var(--text-sm)', color:'var(--text-100)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.name}</span>
                                  <span style={{ fontSize:11, color:col, fontFamily:'var(--font-mono)', marginLeft:8, flexShrink:0 }}>🔥{h.streak}</span>
                                </div>
                                <ProgressBar value={h.completionRate} color={col} height={2} delay={0.1*i+0.2} />
                                <div className="flex items-center justify-between mt-2">
                                  <MetricPill color={col} className="text-[10px]">{h.category}</MetricPill>
                                  <span style={{ fontSize:10, color:'var(--text-400)', fontFamily:'var(--font-mono)' }}>{h.completionRate}%</span>
                                </div>
                              </div>
                            </div>
                          </GlassPanel>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key="patterns-list" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}>
                  <p className="text-label mb-4">CORRELATION PATTERNS</p>
                  <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
                    {correlationPatterns.map((p) => {
                      const c = p.impact === 'positive' ? '#34d399' : p.impact === 'negative' ? '#f87171' : '#22d3ee';
                      const sel = selectedPattern === p.id;
                      return (
                        <motion.div key={p.id} variants={fadeUp}>
                          {sel ? (
                            <CorrelationDetail pattern={p} onClose={() => setSelectedPattern(null)} />
                          ) : (
                            <GlassPanel className="p-4 cursor-pointer" hover onClick={() => setSelectedPattern(p.id)}>
                              <div className="flex items-center gap-3">
                                <span style={{ fontSize:18 }}>{p.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span style={{ fontFamily:'var(--font-display)', fontWeight:500, fontSize:'var(--text-xs)', color:'var(--text-100)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</span>
                                    <MetricPill color={c} className="shrink-0 ml-2 text-[10px]">{p.strength}%</MetricPill>
                                  </div>
                                  <ProgressBar value={p.strength} color={c} height={2} />
                                </div>
                              </div>
                            </GlassPanel>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
