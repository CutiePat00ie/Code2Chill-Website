import React from 'react';

export default function Marquee({ items, reverse = false, className = '' }) {
  const row = (
    <div className="marquee-track" aria-hidden="true">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap">
          {it}
          <span className="text-cyan-400">✺</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${reverse ? 'reverse' : ''} ${className}`}>
      {row}
      {row}
    </div>
  );
}
