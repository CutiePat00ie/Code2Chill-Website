import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, RotateCw, Crown, Quote } from 'lucide-react';

const TINTS = ['#FFD9C7', '#E4DBFF', '#CFF5DF', '#FFF0B8', '#FFD3E4', '#D2E5FF'];

const Social = ({ href, children, label }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} onClick={(e) => e.stopPropagation()}
       className="p-2 rounded-lg border-2 border-[#1F1B24] bg-white/70 text-[#1F1B24] hover:bg-[#1F1B24] hover:text-white transition-colors">
      {children}
    </a>
  ) : null;

const initials = (n = '') => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

// No photos: each member gets an emoji (or initials) badge. Click to flip for more info.
export default function MemberCard({ member, index = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const tint = TINTS[index % TINTS.length];
  const toggle = () => setFlipped((f) => !f);
  return (
    <div
      className={`flip-card cursor-pointer h-[360px] ${flipped ? 'flipped' : ''}`}
      style={{ transform: `rotate(${index % 2 === 0 ? -0.8 : 0.8}deg)` }}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
      aria-label={`${member.name}, ${member.role}. Click to flip.`}
    >
      <div className="flip-inner">
        <div className="flip-face flip-front sticker rounded-3xl overflow-hidden flex flex-col" style={{ background: tint }}>
          <div className="relative flex-1 flex items-center justify-center border-b-2 border-[#1F1B24] text-7xl font-display font-extrabold">
            <span className="floaty" style={{ '--r': '0deg' }}>{member.emoji || initials(member.name) || '⛏️'}</span>
            {member.isHead && (
              <span className="absolute top-3 left-3 sticker bg-[#FFC83D] rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Club Head
              </span>
            )}
          </div>
          <div className="p-4 text-[#1F1B24]">
            <h3 className="text-xl font-extrabold leading-tight">{member.name}</h3>
            <p className="text-sm font-semibold">{member.role}</p>
            {member.year && <p className="text-xs font-mono opacity-70">{member.year}</p>}
            <p className="mt-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 opacity-60"><RotateCw className="w-3 h-3" /> Tap to flip</p>
          </div>
        </div>

        <div className="flip-face flip-back sticker rounded-3xl p-5 flex flex-col gap-3 overflow-y-auto bg-[#FFFDF9]">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider opacity-60">{member.domain}{member.since ? ` · since ${member.since}` : ''}</p>
            <h3 className="text-lg font-extrabold">{member.name}</h3>
          </div>
          {member.bio && <p className="text-sm leading-relaxed">{member.bio}</p>}
          {member.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {member.skills.map((s) => <span key={s} className="px-2 py-0.5 rounded-full text-[11px] font-bold border-2 border-[#1F1B24]" style={{ background: tint }}>{s}</span>)}
            </div>
          )}
          {member.funFact && <p className="text-xs"><span className="font-bold">Fun fact: </span>{member.funFact}</p>}
          {member.quote && <p className="text-sm serif-em flex gap-1.5"><Quote className="w-4 h-4 shrink-0 mt-0.5" />{member.quote}</p>}
          <div className="mt-auto flex items-center gap-2">
            <Social href={member.github} label="GitHub"><Github className="w-4 h-4" /></Social>
            <Social href={member.linkedin} label="LinkedIn"><Linkedin className="w-4 h-4" /></Social>
            <Social href={member.twitter} label="Twitter"><Twitter className="w-4 h-4" /></Social>
            <Social href={member.email ? `mailto:${member.email}` : ''} label="Email"><Mail className="w-4 h-4" /></Social>
          </div>
        </div>
      </div>
    </div>
  );
}
