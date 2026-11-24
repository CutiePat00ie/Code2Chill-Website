import React, { useState } from 'react';

const BG = ['#FFB38A', '#C4B5FD', '#86EFAC', '#FDE68A', '#F9A8D4', '#93C5FD'];

// Photo with a colorful initials fallback (used when a photo is missing or fails to load).
export default function Avatar({ name = '', src, index = 0, className = '' }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center font-display font-extrabold text-[#1F1B24] ${className}`} style={{ background: BG[index % BG.length] }}>
        {initials || '?'}
      </div>
    );
  }
  return <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
