import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AsciiArt from '../ui/AsciiArt';

const LOGO = String.raw`
 ██████ ██████  ██████
██          ██ ██
██      █████  ██
██     ██      ██
 ██████ ███████ ██████
`.replace(/^\n/, '');

const LINES = ['mounting topsoil…', 'loading roots…', 'drilling through bedrock…', 'warming the core…'];

// Percentage loader with an ASCII logo that assembles while the counter climbs.
export default function Loader({ onDone, quick }: { onDone: () => void; quick: boolean }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const total = quick ? 400 : 2400;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / total);
      setPct(Math.round(100 * (1 - Math.pow(1 - t, 2.2))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, quick ? 0 : 450);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, quick]);

  return (
    <motion.div
      className="fixed inset-0 z-[10001] bg-[#0E0C14] text-[#FFF4E6] flex flex-col justify-between p-6 sm:p-10"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.87, 0, 0.13, 1] } }}
      role="status"
      aria-label={`Loading ${pct} percent`}
    >
      <div className="flex justify-between font-mono text-label uppercase text-[#FFF4E6]/60">
        <span>Code2Chill</span>
        <span>Student technical club</span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <AsciiArt art={LOGO} className="text-[10px] sm:text-sm md:text-base text-[#FF7A3D] animate-flicker" />
        <p className="font-mono text-xs uppercase tracking-wideish text-[#FFF4E6]/70 h-4">
          {LINES[Math.min(LINES.length - 1, Math.floor(pct / 26))]}
          <span className="animate-caret">▍</span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <span className="font-mono text-label uppercase text-[#FFF4E6]/60">Descent</span>
          <span className="font-display text-[clamp(4rem,16vw,12rem)] leading-[0.8] font-extrabold tabular-nums">{String(pct).padStart(3, '0')}</span>
        </div>
        <div className="h-px bg-[#FFF4E6]/20"><div className="h-full bg-[#FF7A3D]" style={{ width: `${pct}%` }} /></div>
      </div>
    </motion.div>
  );
}
