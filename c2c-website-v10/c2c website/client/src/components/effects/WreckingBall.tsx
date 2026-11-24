import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePrefs } from '../../context/PrefsContext';
import { thudSound } from '../../lib/sound';

const TARGETS = '.glass-card, .flip-card, .sticker, .wreck';
const N = 11, LINK = 24, R = 32;
const HITS_TO_FALL = 3, REBUILD_MS = 6500, SPEED_MIN = 7;
const COLORS = ['#FFF4E6', '#D9B27C', '#8a5a2b', '#FFB347', '#9aa3ad'];

interface Pt { x: number; y: number; px: number; py: number }
interface Debris { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string }

// Toggle it (button or W key): a heavy wrecking ball dangles from your cursor.
// Swing it hard into cards and headings to crack them. Three hits and a piece falls off, then rebuilds itself.
export default function WreckingBall() {
  const { motion: mo } = useTheme();
  const { sound } = usePrefs();
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const [on, setOn] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'w' || e.key === 'W') && !(e.target as Element).closest?.('input,textarea,select,[contenteditable]')) setOn((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!on || mo === 'off') { delete document.documentElement.dataset.tool; return undefined; }
    document.documentElement.dataset.tool = 'ball';
    const canvas = cv.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let W = 0, H = 0, raf = 0, ax = window.innerWidth / 2, ay = 120;
    const pts: Pt[] = Array.from({ length: N }, (_, i) => ({ x: ax, y: ay + i * LINK, px: ax, py: ay + i * LINK }));
    const debris: Debris[] = [];
    const hits = new WeakMap<Element, number>();
    const cool = new WeakMap<Element, number>();
    const fallen = new Set<HTMLElement>();
    let targets: HTMLElement[] = [];
    let lastQuery = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => { ax = e.clientX; ay = e.clientY; };

    const burst = (x: number, y: number) => {
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 7;
        debris.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3, life: 50 + Math.random() * 30, size: 3 + Math.random() * 5, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
      }
    };

    const wreck = (el: HTMLElement) => {
      fallen.add(el);
      el.style.setProperty('--wr', `${(Math.random() - 0.5) * 50}deg`);
      el.classList.add('wreck-fall');
      setTimeout(() => {
        el.style.transition = 'translate .8s cubic-bezier(.16,1,.3,1), rotate .8s ease-out, opacity .8s';
        el.classList.remove('wreck-fall');
        hits.set(el, 0);
        fallen.delete(el);
        setTimeout(() => { el.style.transition = ''; }, 900);
      }, REBUILD_MS);
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - lastQuery > 400) { targets = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)); lastQuery = now; }

      // verlet chain: first point pinned to the cursor, last point is the heavy ball
      pts[0].x = ax; pts[0].y = ay; pts[0].px = ax; pts[0].py = ay;
      for (let i = 1; i < N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.995, vy = (p.y - p.py) * 0.995;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + (i === N - 1 ? 1.5 : 0.5);
      }
      for (let it = 0; it < 8; it++) {
        for (let i = 0; i < N - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.001;
          const diff = (d - LINK) / d;
          if (i === 0) { b.x -= dx * diff; b.y -= dy * diff; }
          else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; b.x -= dx * diff * 0.5; b.y -= dy * diff * 0.5; }
        }
      }
      const ball = pts[N - 1];
      // keep the ball on screen
      if (ball.x < R) { ball.x = R; ball.px = ball.x + (ball.x - ball.px) * 0.4; }
      if (ball.x > W - R) { ball.x = W - R; ball.px = ball.x + (ball.x - ball.px) * 0.4; }
      if (ball.y > H - R) { ball.y = H - R; ball.py = ball.y + (ball.y - ball.py) * 0.4; }
      const speed = Math.hypot(ball.x - ball.px, ball.y - ball.py);

      // collisions: circle vs element rectangles
      if (speed > SPEED_MIN) {
        for (const el of targets) {
          if (fallen.has(el) || el.classList.contains('wreck-fall')) continue;
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > H || r.width < 40) continue;
          const cx = Math.max(r.left, Math.min(ball.x, r.right)), cy = Math.max(r.top, Math.min(ball.y, r.bottom));
          if (Math.hypot(ball.x - cx, ball.y - cy) > R) continue;
          if (now - (cool.get(el) || 0) < 280) continue;
          cool.set(el, now);
          const n = (hits.get(el) || 0) + 1;
          hits.set(el, n);
          burst(cx, cy);
          if (soundRef.current) thudSound();
          el.animate([{ translate: '0 0' }, { translate: '-7px 3px' }, { translate: '6px -4px' }, { translate: '-3px 2px' }, { translate: '0 0' }], { duration: 240 });
          if (n >= HITS_TO_FALL) wreck(el);
          // the ball bounces off a little
          ball.px = ball.x + (ball.x - ball.px) * 0.6;
          ball.py = ball.y + (ball.y - ball.py) * 0.6;
        }
      }

      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1F1B24'; ctx.lineWidth = 7;
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      ctx.strokeStyle = '#9aa3ad'; ctx.lineWidth = 3; ctx.setLineDash([6, 5]);
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      ctx.setLineDash([]);
      const g = ctx.createRadialGradient(ball.x - 10, ball.y - 12, 4, ball.x, ball.y, R);
      g.addColorStop(0, '#8d8d99'); g.addColorStop(0.45, '#33333d'); g.addColorStop(1, '#0b0b10');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FFF4E6'; ctx.lineWidth = 2; ctx.stroke();

      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.life--; d.vy += 0.35; d.x += d.vx; d.y += d.vy;
        if (d.life <= 0) { debris.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, d.life / 25);
        ctx.fillStyle = d.color;
        ctx.fillRect(d.x, d.y, d.size, d.size);
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      delete document.documentElement.dataset.tool;
    };
  }, [on, mo]);

  if (mo === 'off') return null;
  return (
    <>
      {on && <canvas ref={cv} className="fixed inset-0 w-full h-full pointer-events-none z-[9996]" aria-hidden="true" />}
      <button
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[9991] px-4 py-2 rounded-full border-2 font-mono text-xs font-bold uppercase tracking-wideish transition-colors ${on ? 'bg-brand-orange text-[#1F1B24] border-[#1F1B24]' : 'bg-[#1F1B24] text-[#FFF4E6] border-[#FFF4E6]'}`}
      >
        🔨 Wrecking ball: {on ? 'on' : 'off'} <span className="opacity-60 hidden sm:inline">(W)</span>
      </button>
    </>
  );
}
