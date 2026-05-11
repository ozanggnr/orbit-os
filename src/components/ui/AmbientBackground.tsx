'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#a78bfa', '#22d3ee', '#f8fafc', '#fbbf24', '#34d399'];

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Star = { x: number; y: number; r: number; vx: number; vy: number; op: number; maxOp: number; col: string };
    const count = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 10000));
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.25,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      op: Math.random() * 0.5,
      maxOp: Math.random() * 0.55 + 0.08,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.x  = (s.x + s.vx + canvas.width) % canvas.width;
        s.y  = (s.y + s.vy + canvas.height) % canvas.height;
        s.op = Math.max(0.04, Math.min(s.maxOp, s.op + (Math.random() - 0.5) * 0.008));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.col;
        ctx.globalAlpha = s.op;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      {/* Star canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden />
      {/* Ambient radial gradient layer */}
      <div className="ambient-radial" aria-hidden />
    </>
  );
}
