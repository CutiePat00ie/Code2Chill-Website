import React from 'react';

const GRADS = [
  ['#FF7A3D', '#FF5D8F'], ['#8B5CF6', '#60A5FA'], ['#10B981', '#FFC83D'], ['#FF5D8F', '#8B5CF6'], ['#60A5FA', '#34D399'], ['#FFC83D', '#FF7A3D']
];
const EMOJI = ['💻', '🚀', '🧠', '🛡️', '☁️', '📡', '🧩', '⚡'];

// Colorful cover used instead of photos. Deterministic per title.
export default function CoverArt({ seed = '' }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [a, b] = GRADS[h % GRADS.length];
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
      <span className="absolute -right-4 -bottom-6 text-[9rem] opacity-20 select-none">{'{ }'}</span>
      <span className="text-6xl select-none drop-shadow">{EMOJI[(h >> 3) % EMOJI.length]}</span>
    </div>
  );
}
