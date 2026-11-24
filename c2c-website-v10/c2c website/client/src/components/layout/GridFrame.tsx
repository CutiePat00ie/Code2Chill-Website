import React from 'react';

// Fixed hairline frame: two column rules and corner crosshairs, visible on any background.
export default function GridFrame() {
  const rule = 'absolute inset-y-0 w-px bg-white/30';
  return (
    <div className="fixed inset-0 z-30 pointer-events-none hidden md:block" style={{ mixBlendMode: 'difference' }} aria-hidden="true">
      <div className={rule} style={{ left: 'max(16px, calc(50% - 41rem))' }} />
      <div className={rule} style={{ right: 'max(16px, calc(50% - 41rem))' }} />
      {['left-3 top-[84px]', 'right-3 top-[84px]', 'left-3 bottom-3', 'right-3 bottom-3'].map((p) => (
        <span key={p} className={`absolute ${p} font-mono text-[10px] text-white/60`}>+</span>
      ))}
    </div>
  );
}
