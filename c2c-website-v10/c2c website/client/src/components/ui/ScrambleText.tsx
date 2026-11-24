import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const GLYPHS = '▒▓░#%*+/\\:=-<>[]{}01';
const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Text that assembles from raw characters until it "clicks" into place.
export function useScramble(text: string, run: boolean, opts: { speed?: number; delay?: number; seed?: number } = {}) {
  const { speed = 26, delay = 0, seed = 0 } = opts;
  const { motion } = useTheme();
  const [out, setOut] = useState(motion === 'off' || !run ? text : text.replace(/[^\s]/g, ' '));

  useEffect(() => {
    if (motion === 'off') { setOut(text); return undefined; }
    if (!run) return undefined;
    const settle = Array.from(text, (_, i) => delay + i * speed + Math.random() * 260);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = now - t0;
      let done = true;
      const next = Array.from(text, (ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (t >= settle[i]) return ch;
        done = false;
        return t < settle[i] - 220 ? ' ' : rand();
      }).join('');
      setOut(next);
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, run, motion, speed, delay, seed]);

  return out;
}

interface Props {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
}

export default function ScrambleText({ text, as = 'span', className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [bump, setBump] = useState(0);
  const out = useScramble(text, inView, { delay, seed: bump });
  const Tag = as as any;
  return (
    <Tag ref={ref} className={className} aria-label={text} onMouseEnter={() => setBump((b) => b + 1)}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
