import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// Counts up once when scrolled into view.
export default function CountUp({ to, suffix = '' }) {
  const { motion } = useTheme();
  const ref = useRef(null);
  const [val, setVal] = useState(motion === 'off' ? to : 0);

  useEffect(() => {
    const target = Number(to) || 0;
    if (motion === 'off' || !('IntersectionObserver' in window)) { setVal(target); return undefined; }
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1200, 1);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, motion]);

  return <span ref={ref}>{val}{suffix}</span>;
}
