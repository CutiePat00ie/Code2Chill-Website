import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const TINTS = ['#FFD9C7', '#E4DBFF', '#CFF5DF', '#FFF0B8', '#FFD3E4', '#D2E5FF'];

export default function GoalCard({ goal, index = 0 }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const { motion } = useTheme();
  const [w, setW] = useState(motion === 'off' ? pct : 0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 200); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="sticker rounded-3xl p-5 space-y-3" style={{ background: TINTS[index % TINTS.length], transform: `rotate(${index % 2 ? 0.6 : -0.6}deg)` }}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl wiggle">{goal.emoji}</span>
        <span className="font-mono text-xs font-bold">{pct}%</span>
      </div>
      <h3 className="text-lg font-extrabold leading-tight">{goal.title}</h3>
      <p className="text-sm">{goal.detail}</p>
      <div className="h-3 rounded-full border-2 border-[#1F1B24] bg-white/70 overflow-hidden">
        <div className="h-full bg-[#1F1B24] transition-all duration-1000" style={{ width: `${w}%` }} />
      </div>
      <p className="text-xs font-mono">{goal.current} / {goal.target} {goal.unit}</p>
    </div>
  );
}
