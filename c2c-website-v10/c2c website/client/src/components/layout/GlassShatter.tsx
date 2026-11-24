import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { usePrefs } from '../../context/PrefsContext';
import { glassSound } from '../../lib/sound';
import { CLICKABLE } from '../../lib/clickable';

interface Shard { pts: number[][]; cx: number; cy: number; bx: number; by: number; bw: number; bh: number; vx: number; vy: number; rot: number; vrot: number; flip: number; delay: number; alpha: number; shine: boolean }
interface Fx { x: number; y: number; R: number; full: boolean; t0: number; crack: number; fall: number; shards: Shard[]; maxDelay: number; snap: HTMLCanvasElement | null }
interface Snap { canvas: HTMLCanvasElement; x: number; y: number; t: number }

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// Spider-web crack pattern: rings x sectors with jittered shared vertices, so neighbouring shards fit together.
function build(x: number, y: number, R: number, sectors: number): { shards: Shard[]; maxDelay: number } {
  const radii = [0];
  for (let r = 30; ; r *= 1.5) { radii.push(r); if (r >= R) break; }
  const K = radii.length - 1;
  const base = (Math.PI * 2) / sectors;
  const angles = Array.from({ length: sectors }, (_, i) => i * base + rnd(-0.32, 0.32) * base);
  const verts: number[][][] = [];
  for (let k = 0; k <= K; k++) {
    verts[k] = [];
    for (let i = 0; i < sectors; i++) {
      if (k === 0) { verts[k][i] = [x, y]; continue; }
      const a = angles[i] + rnd(-0.12, 0.12) * base;
      const r = radii[k] * (1 + rnd(-0.12, 0.12));
      verts[k][i] = [x + Math.cos(a) * r, y + Math.sin(a) * r];
    }
  }
  const shards: Shard[] = [];
  let maxDelay = 0;
  for (let k = 0; k < K; k++) {
    for (let i = 0; i < sectors; i++) {
      const j = (i + 1) % sectors;
      const raw = [verts[k][i], verts[k][j], verts[k + 1][j], verts[k + 1][i]];
      const cx = raw.reduce((s, p) => s + p[0], 0) / 4;
      const cy = raw.reduce((s, p) => s + p[1], 0) / 4;
      const pts = raw.map((p) => [p[0] - cx, p[1] - cy]);
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const bx = Math.min(...xs), by = Math.min(...ys);
      const dist = Math.hypot(cx - x, cy - y);
      const push = 1 / (1 + dist / 260);
      const ang = Math.atan2(cy - y, cx - x);
      const delay = (dist / R) * 160 + rnd(0, 90);
      maxDelay = Math.max(maxDelay, delay);
      shards.push({
        pts, cx, cy, bx, by, bw: Math.max(...xs) - bx, bh: Math.max(...ys) - by,
        vx: Math.cos(ang) * 9 * push + rnd(-1.2, 1.2), vy: Math.sin(ang) * 9 * push - rnd(1, 4),
        rot: 0, vrot: rnd(-0.07, 0.07), flip: rnd(0, 6.28), delay, alpha: rnd(0.14, 0.26), shine: Math.random() < 0.35
      });
    }
  }
  return { shards, maxDelay };
}

// Click anything clickable and the screen shatters like glass. The shards are pieces of the real page
// (captured with html2canvas); for links the new page loads behind the falling glass.
export default function GlassShatter() {
  const { motion: mo } = useTheme();
  const { sound } = usePrefs();
  const navigate = useNavigate();
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    if (!canvas || mo === 'off') return undefined;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const fx: Fx[] = [];
    let W = 0, H = 0, raf = 0, busyFull = false;
    let snap: Snap | null = null;
    let capturing: Promise<void> | null = null;
    let lastCap = 0;
    let hoverTimer = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ---- page snapshot (visible viewport only) ----
    const capture = (): Promise<void> => {
      if (capturing) return capturing;
      const sx = window.scrollX, sy = window.scrollY;
      lastCap = performance.now();
      capturing = import('html2canvas')
        .then(({ default: html2canvas }) => html2canvas(document.body, {
          x: sx, y: sy, width: window.innerWidth, height: window.innerHeight,
          scale: Math.min(window.devicePixelRatio || 1, 1),
          useCORS: true, logging: false,
          backgroundColor: getComputedStyle(document.body).backgroundColor
        }))
        .then((c) => { snap = { canvas: c, x: sx, y: sy, t: performance.now() }; })
        .catch(() => { snap = null; })
        .finally(() => { capturing = null; });
      return capturing;
    };
    const fresh = (): HTMLCanvasElement | null =>
      snap && Math.abs(snap.y - window.scrollY) < 3 && Math.abs(snap.x - window.scrollX) < 3 && performance.now() - snap.t < 5000 ? snap.canvas : null;

    // warm the snapshot while the pointer rests on something clickable, so the click needs no waiting
    const onOver = (e: PointerEvent) => {
      clearTimeout(hoverTimer);
      if (e.pointerType === 'touch' || fresh() || capturing || performance.now() - lastCap < 1500) return;
      if (!(e.target as Element).closest?.(CLICKABLE)) return;
      hoverTimer = window.setTimeout(() => { if (!fresh() && !capturing) void capture(); }, 160);
    };
    const onDownWarm = () => { if (!fresh() && !capturing) void capture(); };

    // ---- drawing ----
    const poly = (pts: number[][]) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };

    const frame = (now: number) => {
      raf = 0;
      ctx.clearRect(0, 0, W, H);
      for (let n = fx.length - 1; n >= 0; n--) {
        const e = fx[n];
        const t = now - e.t0;
        if (t > e.crack + e.fall + e.maxDelay) { fx.splice(n, 1); if (e.full) busyFull = false; continue; }

        if (t < 160) { // impact flash
          const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 140);
          g.addColorStop(0, `rgba(255,255,255,${0.85 * (1 - t / 160)})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(e.x - 140, e.y - 140, 280, 280);
        }

        if (t < e.crack) {
          // cracks spread outward from the click while the pane is still whole
          const prog = t / e.crack;
          ctx.save();
          ctx.beginPath(); ctx.arc(e.x, e.y, e.R * prog, 0, Math.PI * 2); ctx.clip();
          for (const s of e.shards) {
            ctx.save(); ctx.translate(s.cx, s.cy); poly(s.pts);
            if (!e.snap) { ctx.fillStyle = `rgba(190,225,255,${s.alpha * 0.6})`; ctx.fill(); }
            ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 3; ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.2; ctx.stroke();
            ctx.restore();
          }
          ctx.restore();
        } else {
          const tt = t - e.crack;
          const k = e.snap ? e.snap.width / W : 1;
          for (const s of e.shards) {
            const f = Math.max(0, tt - s.delay) / 16.67; // frames since this shard let go
            const life = Math.max(0, tt - s.delay) / e.fall;
            if (life >= 1) continue;
            const x = s.cx + s.vx * f;
            const y = s.cy + s.vy * f + 0.25 * f * f;
            const fade = life < 0.6 ? 1 : 1 - (life - 0.6) / 0.4;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(s.rot + s.vrot * f);
            ctx.scale(Math.max(0.15, Math.abs(Math.cos(s.flip + f * 0.06))), 1);
            poly(s.pts);
            if (e.snap) {
              // a piece of the actual page
              ctx.save();
              ctx.clip();
              ctx.globalAlpha = fade;
              ctx.drawImage(e.snap, (s.cx + s.bx) * k, (s.cy + s.by) * k, Math.max(1, s.bw * k), Math.max(1, s.bh * k), s.bx, s.by, s.bw, s.bh);
              ctx.fillStyle = `rgba(190,225,255,${0.1 * fade})`;
              ctx.fill();
              ctx.restore();
            } else {
              ctx.fillStyle = `rgba(190,225,255,${s.alpha * fade})`; ctx.fill();
            }
            ctx.strokeStyle = `rgba(255,255,255,${0.85 * (1 - life * 0.7)})`; ctx.lineWidth = 1.4; ctx.stroke();
            if (s.shine) {
              ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - life)})`; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.moveTo(s.pts[0][0] * 0.6, s.pts[0][1] * 0.6); ctx.lineTo(s.pts[2][0] * 0.6, s.pts[2][1] * 0.6); ctx.stroke();
            }
            ctx.restore();
          }
        }
      }
      if (fx.length) raf = requestAnimationFrame(frame);
    };

    const shatter = (x: number, y: number, full: boolean, pic: HTMLCanvasElement | null) => {
      const R = full ? Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 40 : 240;
      const { shards, maxDelay } = build(x, y, R, full ? 18 : 13);
      fx.push({ x, y, R, full, t0: performance.now(), crack: full ? 170 : 100, fall: full ? 1000 : 750, shards, maxDelay, snap: pic });
      if (full) busyFull = true;
      if (soundRef.current) glassSound();
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || document.documentElement.dataset.tool === 'ball') return;
      const el = (e.target as Element).closest?.(CLICKABLE) as HTMLElement | null;
      if (!el || (el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true') return;

      let x = e.clientX, y = e.clientY;
      if (e.detail === 0) { const r = el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; } // keyboard activation

      const a = el.closest('a[href]') as HTMLAnchorElement | null;
      const plain = !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
      const internal = !!a && plain && !a.hasAttribute('download') && (!a.target || a.target === '_self') && a.origin === window.location.origin;

      if (internal && a && !busyFull) {
        e.preventDefault();
        e.stopPropagation(); // the router would otherwise navigate instantly
        const path = a.pathname + a.search + a.hash;
        const go = (pic: HTMLCanvasElement | null) => { shatter(x, y, true, pic); setTimeout(() => navigate(path), 170); };
        const pic = fresh();
        if (pic) go(pic);
        else void Promise.race([capture(), new Promise((r) => setTimeout(r, 450))]).then(() => go(fresh())); // no snapshot yet: wait briefly, else plain glass
      } else if (!internal) {
        shatter(x, y, false, fresh()); // buttons never wait; the next hover warms a snapshot
        if (!fresh() && !capturing) void capture();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('click', onClick, true); // capture phase: runs before React's handlers
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDownWarm, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hoverTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDownWarm);
    };
  }, [mo, navigate]);

  if (mo === 'off') return null;
  return <canvas ref={cv} data-html2canvas-ignore="true" className="fixed inset-0 w-full h-full pointer-events-none z-[10002]" aria-hidden="true" />;
}
