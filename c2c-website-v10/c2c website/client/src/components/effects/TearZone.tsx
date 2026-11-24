import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePrefs } from '../../context/PrefsContext';
import { chainsawSound } from '../../lib/sound';

type Kind = 'strata' | 'magma' | 'void';
interface Seg { x0: number; y0: number; x1: number; y1: number; w: number; t: number }
interface Star { x: number; y: number; r: number; p: number }
interface Chip { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string }

const HOLD = 6000; // cuts stay open this long...
const LIFE = 9000; // ...then the earth slowly heals
const INTERACTIVE = 'a,button,input,textarea,select,label,summary,[role="button"],.glass-card,.flip-card,.glass-panel,.sticker,.depth-rail,.wreck';
const STRATA = ['#C9A06A', '#A87B4F', '#7E5A3A', '#B88E5C', '#6B4A2E', '#946A43'];
const CHIP_COLORS = ['#FFF4E6', '#D9B27C', '#8a5a2b', '#FFB347', '#FF7A3D'];

// What you see underneath the cut.
function drawReveal(c: CanvasRenderingContext2D, w: number, h: number, kind: Kind, now: number, stars: Star[]) {
  if (kind === 'strata') {
    const band = 46;
    for (let i = 0, y = 0; y < h; i++, y += band) {
      c.fillStyle = STRATA[i % STRATA.length];
      c.fillRect(0, y, w, band + 2);
      c.strokeStyle = 'rgba(40,20,5,.35)';
      c.lineWidth = 2;
      c.beginPath();
      for (let x = 0; x <= w; x += 20) c.lineTo(x, y + Math.sin(x * 0.02 + i * 1.7) * 7);
      c.stroke();
    }
    c.fillStyle = 'rgba(40,20,5,.35)';
    stars.slice(0, 60).forEach((s) => { c.beginPath(); c.arc(s.x, s.y, s.r * 2.2, 0, 6.3); c.fill(); });
  } else if (kind === 'magma') {
    c.fillStyle = '#2a0705';
    c.fillRect(0, 0, w, h);
    for (let k = 0; k < 5; k++) {
      const cx = (Math.sin(now / 2200 + k * 2.1) * 0.5 + 0.5) * w;
      const cy = (Math.cos(now / 2700 + k * 1.3) * 0.5 + 0.5) * h;
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, 260);
      g.addColorStop(0, 'rgba(255,190,70,.95)');
      g.addColorStop(0.5, 'rgba(255,90,30,.55)');
      g.addColorStop(1, 'rgba(255,60,20,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    }
  } else {
    c.fillStyle = '#0a0720';
    c.fillRect(0, 0, w, h);
    const gx = (Math.sin(now / 3000) * 0.5 + 0.5) * w;
    const g = c.createRadialGradient(gx, h / 2, 0, gx, h / 2, 420);
    g.addColorStop(0, 'rgba(139,92,246,.55)');
    g.addColorStop(1, 'rgba(139,92,246,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    stars.forEach((s) => {
      c.fillStyle = `rgba(255,255,255,${0.35 + 0.65 * Math.abs(Math.sin(now / 420 + s.p))})`;
      c.beginPath(); c.arc(s.x, s.y, s.r, 0, 6.3); c.fill();
    });
  }
}

// The chainsaw sprite: tip at (0,0), pointing along +x. Chain teeth crawl along the bar.
function drawSaw(c: CanvasRenderingContext2D, x: number, y: number, ang: number, now: number) {
  c.save();
  c.translate(x + (Math.random() - 0.5) * 3, y + (Math.random() - 0.5) * 3);
  c.rotate(ang);
  if (Math.cos(ang) < 0) c.scale(1, -1); // keep the engine on top when cutting leftwards
  c.scale(0.8, 0.8);
  c.lineJoin = 'round';
  c.strokeStyle = '#1F1B24';
  c.lineWidth = 3;
  const rr = (rx: number, ry: number, rw: number, rh: number, r: number) => { c.beginPath(); c.roundRect(rx, ry, rw, rh, r); };
  rr(-74, -9, 74, 18, 9); c.fillStyle = '#AEB6BF'; c.fill(); c.stroke();          // guide bar
  c.save(); c.setLineDash([5, 5]); c.lineDashOffset = -now / 18; c.lineWidth = 2.5;
  rr(-72, -8, 70, 16, 8); c.stroke(); c.restore();                                  // moving chain
  rr(-148, -22, 78, 44, 10); c.fillStyle = '#FF7A3D'; c.fill(); c.stroke();        // engine body
  c.fillStyle = '#1F1B24'; c.fillRect(-138, -4, 50, 8);                             // stripe
  c.beginPath(); c.roundRect(-140, -40, 48, 18, 8); c.lineWidth = 5; c.stroke();   // top handle
  rr(-176, -9, 32, 18, 6); c.lineWidth = 3; c.fillStyle = '#3a3a44'; c.fill(); c.stroke(); // rear handle
  c.restore();
}

// Hold the mouse and drag across empty background: a chainsaw cuts it open. Cuts heal after a few seconds.
export default function TearZone({ kind }: { kind: Kind }) {
  const { motion: mo } = useTheme();
  const { sound } = usePrefs();
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const cv = useRef<HTMLCanvasElement>(null);
  const [torn, setTorn] = useState(false);

  useEffect(() => {
    const canvas = cv.current;
    const zone = canvas?.parentElement;
    if (!canvas || !zone || mo === 'off') return undefined;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const off = document.createElement('canvas');
    const octx = off.getContext('2d') as CanvasRenderingContext2D;

    let W = 0, H = 0, raf = 0, drawing = false, flagged = false;
    let last: { x: number; y: number } | null = null;
    let sawAng = 0, targetAng = 0;
    let stopSaw: (() => void) | null = null;
    let stars: Star[] = [];
    const segs: Seg[] = [];
    const chips: Chip[] = [];

    const resize = () => {
      const r = zone.getBoundingClientRect();
      W = r.width; H = r.height;
      const dpr = H > 1400 ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      [canvas, off].forEach((cn) => { cn.width = Math.round(W * dpr); cn.height = Math.round(H * dpr); });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 140 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.5 + Math.random() * 1.6, p: Math.random() * 6.28 }));
      segs.length = 0; chips.length = 0;
    };

    const scale = (s: Seg, now: number) => { const a = now - s.t; return a < HOLD ? 1 : Math.max(0, 1 - (a - HOLD) / (LIFE - HOLD)); };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      for (let i = segs.length - 1; i >= 0; i--) if (now - segs[i].t > LIFE) segs.splice(i, 1);

      if (segs.length) {
        const pass = (c: CanvasRenderingContext2D, color: string, extra: number) => {
          c.lineCap = 'round';
          c.strokeStyle = color;
          for (const s of segs) {
            const k = scale(s, now);
            if (k <= 0) continue;
            c.lineWidth = Math.max(0.1, (s.w + extra) * k);
            c.beginPath(); c.moveTo(s.x0, s.y0); c.lineTo(s.x1, s.y1); c.stroke();
          }
        };
        pass(ctx, 'rgba(0,0,0,.4)', 14);   // shadow of the cut
        pass(ctx, '#2b1a0e', 8);           // scorched edge
        octx.globalCompositeOperation = 'source-over';
        octx.clearRect(0, 0, W, H);
        pass(octx, '#000', 0);             // the kerf
        octx.globalCompositeOperation = 'source-in';
        drawReveal(octx, W, H, kind, now, stars);
        octx.globalCompositeOperation = 'source-over';
        ctx.drawImage(off, 0, 0, W, H);
      }

      // wood chips and sparks flying out of the cut
      for (let i = chips.length - 1; i >= 0; i--) {
        const p = chips[i];
        p.life--; p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.vx *= 0.985;
        if (p.life <= 0) { chips.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, p.life / (p.max * 0.5));
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
      }
      ctx.globalAlpha = 1;

      if (drawing && last) {
        let d = targetAng - sawAng;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        sawAng += d * 0.25;
        drawSaw(ctx, last.x, last.y, sawAng, now);
      }
    };

    const loop = (now: number) => { raf = 0; draw(now); if (segs.length || chips.length || drawing) raf = requestAnimationFrame(loop); };
    const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const ballOn = () => document.documentElement.dataset.tool === 'ball';

    const spray = (x: number, y: number, ang: number) => {
      for (let i = 0; i < 4; i++) {
        const a = ang + Math.PI + (Math.random() - 0.5) * 1.6;
        const sp = 3 + Math.random() * 6;
        const max = 35 + Math.random() * 35;
        chips.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: max, max, size: 2 + Math.random() * 3.5, color: CHIP_COLORS[Math.floor(Math.random() * CHIP_COLORS.length)] });
      }
      if (chips.length > 220) chips.splice(0, chips.length - 220);
    };

    const stopEngine = () => { stopSaw?.(); stopSaw = null; };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === 'touch' || ballOn() || (e.target as Element).closest(INTERACTIVE)) return;
      const r = canvas.getBoundingClientRect();
      drawing = true;
      last = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (soundRef.current) stopSaw = chainsawSound();
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!drawing || !last) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const d = Math.hypot(x - last.x, y - last.y);
      if (d < 6) return;
      targetAng = Math.atan2(y - last.y, x - last.x);
      const j = () => (Math.random() - 0.5) * 5;
      const nx = x + j(), ny = y + j();
      segs.push({ x0: last.x, y0: last.y, x1: nx, y1: ny, w: 34 + Math.random() * 8, t: performance.now() });
      spray(nx, ny, targetAng);
      last = { x: nx, y: ny };
      if (!flagged) { flagged = true; setTorn(true); }
      start();
    };
    const onUp = () => { drawing = false; last = null; stopEngine(); };
    const onMouseDown = (e: MouseEvent) => { if (e.button === 0 && !ballOn() && !(e.target as Element).closest(INTERACTIVE)) e.preventDefault(); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(zone);
    zone.classList.add('tear-zone');
    zone.addEventListener('pointerdown', onDown);
    zone.addEventListener('mousedown', onMouseDown);
    zone.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      cancelAnimationFrame(raf);
      stopEngine();
      ro.disconnect();
      zone.classList.remove('tear-zone');
      zone.removeEventListener('pointerdown', onDown);
      zone.removeEventListener('mousedown', onMouseDown);
      zone.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [kind, mo]);

  if (mo === 'off') return null;
  return (
    <>
      <canvas ref={cv} className="absolute inset-0 w-full h-full pointer-events-none z-[5]" aria-hidden="true" />
      {!torn && <span className="tear-hint hidden md:inline-flex" aria-hidden="true">🪚 hold &amp; drag to chainsaw the background</span>}
    </>
  );
}
