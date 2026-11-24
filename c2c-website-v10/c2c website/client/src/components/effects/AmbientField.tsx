import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Band { max: number; color: string; vy: number; vx: number; size: [number, number]; alpha: number; shape: 'dot' | 'square' | 'star' }

// What floats around changes with depth: pollen, dust, crystal specks, embers, sparks.
const BANDS: Band[] = [
  { max: 0.1, color: '255,255,255', vy: -0.15, vx: 0.25, size: [1.5, 3.5], alpha: 0.6, shape: 'dot' },
  { max: 0.45, color: '230,200,150', vy: 0.18, vx: 0.05, size: [1, 3], alpha: 0.5, shape: 'square' },
  { max: 0.7, color: '150,230,255', vy: -0.05, vx: 0, size: [1, 3], alpha: 0.9, shape: 'star' },
  { max: 0.88, color: '255,140,50', vy: -0.6, vx: 0.1, size: [1.5, 3.5], alpha: 0.85, shape: 'dot' },
  { max: 1.01, color: '255,230,120', vy: -1, vx: 0.2, size: [1, 3], alpha: 0.9, shape: 'dot' }
];
const GLYPHS = ['{ }', '</>', '=>', ';', '++', '0x', '#!', '[]', '&&', '01'];

interface P { x: number; y: number; vx: number; vy: number; s: number; ph: number; g?: string }

export default function AmbientField({ pRef }: { pRef: React.MutableRefObject<number> }) {
  const { motion: mo } = useTheme();
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas || mo === 'off') return undefined;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let W = 0, H = 0, raf = 0, mx = -999, my = -999;
    let parts: P[] = [];

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(30, Math.min(80, Math.round(W / 20)));
      parts = Array.from({ length: n + 14 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, s: Math.random(), ph: Math.random() * 6.28,
        g: i >= n ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : undefined
      }));
    };
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const v = (window as any).__scrollVel || 0;
      const band = BANDS.find((b) => pRef.current <= b.max) || BANDS[0];
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const glyph = !!p.g;
        const ty = band.vy * (0.5 + p.s * 1.5) * (glyph ? 0.4 : 1) + (glyph ? 0.15 : 0);
        const tx = band.vx * (0.5 + p.s) + Math.sin(now / 1500 + p.ph) * 0.15;
        p.vx += (tx - p.vx) * 0.03;
        p.vy += (ty - p.vy) * 0.03;
        p.x += p.vx; p.y += p.vy - v * (0.3 + p.s * 0.7);
        // cursor pushes particles away
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 130 && d > 0.1) { const f = (130 - d) * 0.05; p.x += (dx / d) * f; p.y += (dy / d) * f; }
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        const twinkle = 0.55 + 0.45 * Math.sin(now / 500 + p.ph);
        if (glyph) {
          ctx.font = '600 14px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(${band.color},${0.2 * twinkle + 0.08})`;
          ctx.fillText(p.g as string, p.x, p.y);
          continue;
        }
        const size = band.size[0] + p.s * (band.size[1] - band.size[0]);
        ctx.fillStyle = `rgba(${band.color},${band.alpha * twinkle})`;
        if (band.shape === 'square') ctx.fillRect(p.x, p.y, size, size);
        else if (band.shape === 'star') { ctx.fillRect(p.x - size * 2, p.y - 0.5, size * 4, 1); ctx.fillRect(p.x - 0.5, p.y - size * 2, 1, size * 4); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, 6.3); ctx.fill(); }
        if (Math.abs(v) > 4 && band.shape !== 'star') { // streak while scrolling fast
          ctx.strokeStyle = ctx.fillStyle as string; ctx.lineWidth = size; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + v * 1.6); ctx.stroke();
        }
      }
    };

    init();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', init);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init); window.removeEventListener('pointermove', onMove); };
  }, [mo, pRef]);

  if (mo === 'off') return null;
  return <canvas ref={cv} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />;
}
