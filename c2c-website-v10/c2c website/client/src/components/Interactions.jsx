import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// One place for the site's "reactive" behaviour (all skipped when Animations are off):
// scroll progress bar, cursor ring, magnetic buttons, mouse parallax, reveal-on-scroll.
export default function Interactions() {
  const { motion } = useTheme();
  const { pathname } = useLocation();
  const bar = useRef(null);
  const ring = useRef(null);
  const io = useRef(null);

  // scroll progress (always on, it is not decorative motion)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.current?.style.setProperty('--p', max > 0 ? (h.scrollTop / max).toFixed(3) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [pathname]);

  // cursor ring, magnetic buttons, parallax variables
  useEffect(() => {
    if (motion === 'off') return undefined;
    const root = document.documentElement;
    const r = ring.current;
    let magnet = null;
    const onMove = (e) => {
      root.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      root.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      if (r) {
        r.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        r.classList.add('on');
        const hot = e.target.closest?.('a, button, [role="button"], input, textarea, select, label');
        r.classList.toggle('big', !!hot);
      }
      const btn = e.target.closest?.('.btn-primary, .btn-secondary');
      if (btn) {
        const b = btn.getBoundingClientRect();
        btn.style.translate = `${(e.clientX - (b.left + b.width / 2)) * 0.18}px ${(e.clientY - (b.top + b.height / 2)) * 0.25}px`;
        magnet = btn;
      } else if (magnet) { magnet.style.translate = ''; magnet = null; }
    };
    const onDown = () => r?.classList.add('down');
    const onUp = () => r?.classList.remove('down');
    const onLeave = () => r?.classList.remove('on');
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [motion]);

  return (
    <>
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
