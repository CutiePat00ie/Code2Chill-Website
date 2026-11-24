import React, { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useScramble } from './ScrambleText';

export const EARTH_ART = String.raw`
        _.-''''''-._
      .'  .   :   .  '.
     /  .  '  ·  '  .  \
    |  ' ░░░░░░░░░░░ '  |
    |  . ▒▒▒▒▒▒▒▒▒▒▒ .  |
    |  ' ▓▓▓▓▓▓▓▓▓▓▓ '  |
    |  . ███ C2C ███ .  |
     \  '  .  ·  .  '  /
      '.  .   :   .  .'
        '-.______.-'
`.replace(/^\n/, '');

// Raw-character illustration that assembles itself; click it to rebuild.
export default function AsciiArt({ art = EARTH_ART, className = '' }: { art?: string; className?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  const out = useScramble(art, inView, { speed: 7, delay: 150, seed: n });
  return (
    <pre
      ref={ref}
      onClick={() => setN((x) => x + 1)}
      className={`font-mono leading-[1.15] whitespace-pre select-none cursor-pointer ${className}`}
      role="img"
      aria-label="ASCII illustration of the earth's layers. Click to rebuild it."
    >
      {out}
    </pre>
  );
}
