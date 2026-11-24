import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { usePrefs } from '../../context/PrefsContext';
import { CLICKABLE } from '../../lib/clickable';

const TOKENS = ['{ }', '</>', '=>', ';', '++', '0x', '#!', '[]', '&&', '404'];
const COLORS = ['#FF7A3D', '#FF5D8F', '#8B5CF6', '#34D399', '#FFC83D', '#60A5FA'];

interface Burst { id: number; x: number; y: number; parts: { t: string; c: string; dx: number; dy: number; r: number }[] }

// Click anywhere: ripple ring + code-symbol particles + optional click sound.
export default function ClickFX() {
  const { motion: mo } = useTheme();
  const { playClick } = usePrefs();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      setClicks((c) => c + 1);
      // clickable things get the glass shatter instead of the symbol burst
      if (mo !== 'off' && (e.target as Element).closest?.(CLICKABLE)) return;
      playClick();
      if (mo === 'off') return;
      const id = performance.now() + Math.random();
      const parts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 6 + Math.random() * 0.8;
        const d = 44 + Math.random() * 56;
        return { t: TOKENS[Math.floor(Math.random() * TOKENS.length)], c: COLORS[Math.floor(Math.random() * COLORS.length)], dx: Math.cos(a) * d, dy: Math.sin(a) * d - 18, r: (Math.random() - 0.5) * 70 };
      });
      setBursts((b) => [...b.slice(-5), { id, x: e.clientX, y: e.clientY, parts }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1000);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [mo, playClick]);

  return (
    <>
      {clicks > 0 && <div className="click-pill">clicks: {clicks}</div>}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
        <AnimatePresence>
          {bursts.map((b) => (
            <React.Fragment key={b.id}>
              <motion.span
                className="absolute rounded-full border-2 border-[#FF7A3D]"
                style={{ left: b.x, top: b.y, x: '-50%', y: '-50%' }}
                initial={{ width: 8, height: 8, opacity: 0.9 }}
                animate={{ width: 120, height: 120, opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              {b.parts.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute font-mono font-bold text-sm"
                  style={{ left: b.x, top: b.y, color: p.c }}
                  initial={{ x: '-50%', y: '-50%', opacity: 1, scale: 0.5 }}
                  animate={{ x: p.dx, y: p.dy, rotate: p.r, opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.9, ease: [0.2, 0.8, 0.3, 1] }}
                >
                  {p.t}
                </motion.span>
              ))}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
