import { useEffect } from 'react';
import Lenis from 'lenis';
import { useTheme } from '../../context/ThemeContext';

// Inertial smooth scrolling + live scroll velocity (used by particles and floating decorations).
export default function SmoothScroll({ paused }: { paused: boolean }) {
  const { motion } = useTheme();

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (motion === 'off' || reduced) { (window as any).__lenis = null; (window as any).__scrollVel = 0; return undefined; }

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      // let modals, flip cards, textareas and selects scroll on their own
      prevent: (node: Element) => !!node.closest?.('[data-lenis-prevent],[role="dialog"],.overflow-y-auto,textarea,select')
    } as any);
    (window as any).__lenis = lenis;

    let decos: NodeListOf<HTMLElement> | null = null;
    lenis.on('scroll', (e: any) => {
      const v = Math.max(-24, Math.min(24, e.velocity || 0));
      (window as any).__scrollVel = v;
      decos = decos && decos.length ? decos : document.querySelectorAll<HTMLElement>('.deco');
      // floating decorations swing with scroll speed
      decos.forEach((el) => { el.style.rotate = `${(v * 0.3).toFixed(2)}deg`; });
    });

    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      (window as any).__lenis = null;
      (window as any).__scrollVel = 0;
      document.querySelectorAll<HTMLElement>('.deco').forEach((el) => { el.style.rotate = ''; });
    };
  }, [motion]);

  useEffect(() => {
    const l = (window as any).__lenis;
    if (!l) return;
    if (paused) l.stop(); else l.start();
  }, [paused, motion]);

  return null;
}
