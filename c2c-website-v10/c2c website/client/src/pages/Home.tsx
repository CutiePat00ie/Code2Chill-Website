import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Plus, PartyPopper, CheckCircle2, Circle, GraduationCap, Trophy, Mic, Hammer, Crown } from 'lucide-react';
import { eventsAPI, projectsAPI, statsAPI, teamAPI, contentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import ProjectCard from '../components/ProjectCard';
import DomainCard from '../components/DomainCard';
import MemberCard from '../components/MemberCard';
import GoalCard from '../components/GoalCard';
import CountUp from '../components/CountUp';
import AnnouncementBanner from '../components/AnnouncementBanner';
import SubmitProjectModal from '../components/SubmitProjectModal';
import ScrambleText from '../components/ui/ScrambleText';
import AsciiArt from '../components/ui/AsciiArt';
import { scrollToTarget } from '../lib/scroll';
import TearZone from '../components/effects/TearZone';
import WreckingBall from '../components/effects/WreckingBall';
import AmbientField from '../components/effects/AmbientField';
import { Reveal, StaggerGrid } from '../components/ui/Reveal';
import JoinUs from './JoinUs';
import Contact from './Contact';

const LAYERS = [
  { id: 'surface', name: 'Surface' }, { id: 'about', name: 'Topsoil' }, { id: 'domains', name: 'Roots' }, { id: 'events', name: 'Bedrock' },
  { id: 'projects', name: 'Crystal Caves' }, { id: 'team', name: 'Aquifer' }, { id: 'goals', name: 'Mantle' }, { id: 'join', name: 'Core' }
];

// background colour at each scroll depth (0 = sky, 1 = the core)
const STOPS: [number, number[]][] = [
  [0, [125, 200, 255]], [0.07, [196, 232, 255]], [0.13, [124, 88, 54]], [0.3, [94, 64, 40]],
  [0.5, [66, 62, 78]], [0.7, [38, 30, 58]], [0.86, [128, 34, 30]], [1, [255, 150, 60]]
];
const mix = (p: number) => {
  for (let i = 1; i < STOPS.length; i++) {
    if (p <= STOPS[i][0]) {
      const [p0, c0] = STOPS[i - 1]; const [p1, c1] = STOPS[i];
      const t = (p - p0) / (p1 - p0);
      return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * t)).join(',')})`;
    }
  }
  return 'rgb(255,150,60)';
};
const fmtDepth = (p: number) => {
  const m = 6371000 * Math.pow(p, 4);
  if (m < 1000) return `${Math.round(m)} m`;
  return `${m >= 100000 ? Math.round(m / 1000).toLocaleString() : (m / 1000).toFixed(1)} km`;
};

const INK = 'text-[#1F1B24]';
const CREAM = 'text-[#FFF4E6]';

const Deco = ({ children, k = 0.1, className = '' }: { children?: React.ReactNode; k?: number; className?: string }) => (
  <span className={`deco ${className}`} style={{ ['--k' as any]: k }} aria-hidden="true">{children}</span>
);

interface LayerProps { id: string; index: number; tone?: 'ink' | 'cream'; className?: string; decos?: React.ReactNode; children: React.ReactNode }
const Layer = ({ id, index, tone = 'cream', className = '', decos, children }: LayerProps) => (
  <section id={id} data-layer className={`relative overflow-hidden px-4 sm:px-6 py-24 sm:py-36 border-t border-current/40 ${tone === 'ink' ? INK : CREAM} ${className}`}>
    <div className="max-w-[82rem] mx-auto relative z-10 space-y-14 md:px-6">{children}</div>
    {decos}
  </section>
);

// editorial header: mono index row, assembling uppercase title, full-width rule
const SectionHeader = ({ index, label, title, sub }: { index: number; label: string; title: string; sub?: string }) => {
  return (
  <header className="space-y-6">
    <div className="flex items-center justify-between font-mono text-label uppercase opacity-80">
      <span>{String(index).padStart(2, '0')} / {String(LAYERS.length - 1).padStart(2, '0')}</span>
      <span>{label}</span>
    </div>
    <h2 className="wreck font-display text-title uppercase"><ScrambleText text={title} /></h2>
    <div className="grid md:grid-cols-12 gap-6 border-t border-current/40 pt-6">
      {sub && <p className="md:col-span-5 md:col-start-8 text-base sm:text-lg leading-relaxed opacity-90">{sub}</p>}
    </div>
  </header>
  );
};

const WHAT = [
  { icon: GraduationCap, title: 'Workshops', text: 'Hands-on sessions that turn theory into working code.' },
  { icon: Trophy, title: 'Competitions & hackathons', text: 'Race the clock, build fast, win.' },
  { icon: Mic, title: 'Technical talks', text: 'Seniors and industry folks share what really works.' },
  { icon: Hammer, title: 'Project-building', text: 'Squad up and ship something real.' }
];

const Home = () => {
  const { user } = useAuth();
  const bgRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pRef = useRef(0);
  const heroRef = useRef<HTMLElement>(null);
  const [depth, setDepth] = useState({ p: 0, layer: 0 });
  const [stats, setStats] = useState({ activeMembers: 0, eventsOrganized: 0, innovativeProjects: 0, hackathonsWon: 0 });
  const [domains, setDomains] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [content, setContent] = useState<{ goals: any[]; roadmap: any[] }>({ goals: [], roadmap: [] });
  const [tab, setTab] = useState('All');
  const [modal, setModal] = useState(false);

  // scroll-driven hero: title drifts up and fades as you start to dig
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  const loadProjects = useCallback(async () => {
    try { const r = await projectsAPI.getProjects(); if (r.data.success) setProjects(r.data.data); } catch { /* offline */ }
  }, []);

  useEffect(() => {
    const safe = (p: Promise<any>) => p.catch(() => null);
    (async () => {
      const [s, d, e, t, c] = await Promise.all([
        safe(statsAPI.getStats()), safe(statsAPI.getDomains()), safe(eventsAPI.getEvents()),
        safe(teamAPI.getTeamMembers()), safe(contentAPI.getContent())
      ]);
      if (s?.data.success) setStats(s.data.data);
      if (d?.data.success) setDomains(d.data.data);
      if (e?.data.success) setEvents(e.data.data.slice(0, 6));
      if (t?.data.success) setTeam(t.data.data);
      if (c?.data.success) setContent(c.data.data);
    })();
    loadProjects();
  }, [loadProjects]);

  // scroll = digging: background colour, depth readout, per-section parallax offsets
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = Math.max(1, h.scrollHeight - h.clientHeight);
      const p = Math.min(1, Math.max(0, h.scrollTop / max));
      pRef.current = p;
      if (bgRef.current) bgRef.current.style.backgroundColor = mix(p);
      let layer = 0;
      rootRef.current?.querySelectorAll<HTMLElement>('[data-layer]').forEach((el, i) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--off', String(Math.round(r.top + r.height / 2 - window.innerHeight / 2)));
        if (r.top <= window.innerHeight * 0.45) layer = i;
      });
      setDepth((d) => (d.layer === layer && Math.abs(d.p - p) < 0.002 ? d : { p, layer }));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const jump = (id: string) => scrollToTarget(document.getElementById(id));
  const confetti = async () => {
    const { default: fire } = await import('canvas-confetti');
    fire({ particleCount: 160, spread: 90, origin: { y: 0.7 }, colors: ['#FF7A3D', '#FF5D8F', '#FFC83D', '#FFFFFF'] });
  };

  const isOngoing = (p: any) => p.status === 'Active' || p.status === 'In Development';
  const shownProjects = projects.filter((p) => (tab === 'All' ? true : tab === 'Ongoing' ? isOngoing(p) : p.status === 'Completed'));
  const counts: Record<string, number> = { All: projects.length, Ongoing: projects.filter(isOngoing).length, Completed: projects.filter((p) => p.status === 'Completed').length };
  const heads = team.filter((m) => m.isHead);
  const others = team.filter((m) => !m.isHead);
  const statCards = [
    { n: stats.activeMembers, label: 'Members' }, { n: stats.eventsOrganized, label: 'Events run' },
    { n: stats.innovativeProjects, label: 'Projects built' }, { n: stats.hackathonsWon, label: 'Hackathon wins' }
  ];
  const chip = (active: boolean) => `px-5 py-2 border font-mono text-xs uppercase tracking-wideish transition-all duration-300 ease-expo hover:-translate-y-0.5 ${active ? 'bg-brand-orange text-[#1F1B24] border-brand-orange' : 'border-current/50 hover:border-brand-orange hover:text-brand-orange'}`;

  return (
    <div ref={rootRef}>
      <div ref={bgRef} className="earth-bg" style={{ backgroundColor: 'rgb(125,200,255)' }}>
        <span className="blob w-[38vw] h-[38vw] -left-[8vw] top-[6vh]" style={{ background: 'rgba(255,255,255,.5)' }} />
        <span className="blob w-[30vw] h-[30vw] right-[-6vw] top-[40vh]" style={{ background: 'rgba(255,122,61,.55)', animationDelay: '-8s' }} />
        <span className="blob w-[34vw] h-[34vw] left-[30vw] bottom-[-10vh]" style={{ background: 'rgba(139,92,246,.5)', animationDelay: '-15s' }} />
      </div>
      <AmbientField pRef={pRef} />
      <WreckingBall />

      <nav className="depth-rail" aria-label="Layers">
        {LAYERS.map((l, i) => (
          <button key={l.id} onClick={() => jump(l.id)} className={`depth-dot ${depth.layer === i ? 'act' : ''}`} aria-label={`Go to ${l.name}`}><span>{l.name}</span></button>
        ))}
      </nav>
      <div className="depth-pill">⬇ {fmtDepth(depth.p)} · {LAYERS[depth.layer].name}</div>

      <AnnouncementBanner />

      {/* 00 SURFACE */}
      <section id="surface" ref={heroRef} data-layer className={`relative overflow-hidden px-4 sm:px-6 min-h-[94vh] flex flex-col justify-between ${INK}`}>
        <TearZone kind="strata" />
        <Deco k={-0.25} className="right-[8%] top-12 text-7xl sm:text-9xl">☀️</Deco>
        <Deco k={0.15} className="left-[4%] top-24 text-6xl sm:text-8xl drift">☁️</Deco>
        <Deco k={0.3} className="right-[30%] top-44 text-5xl sm:text-7xl drift">☁️</Deco>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-[82rem] w-full mx-auto md:px-6 pt-14 relative z-10">
          <div className="flex items-center justify-between font-mono text-label uppercase border-b border-current/40 pb-4">
            <span>00 / 07</span>
            <span>Surface · 0 m</span>
            <span className="hidden sm:inline">Student-led technical club</span>
          </div>
          <div className="grid lg:grid-cols-12 gap-8 items-end pt-10">
            <div className="lg:col-span-8 space-y-8">
              <h1 className="font-display text-display uppercase"><ScrambleText text="Code2Chill" delay={300} /></h1>
              <p className="text-lg sm:text-xl max-w-xl font-medium leading-relaxed">
                Software, web &amp; mobile, AI/ML, cybersecurity, cloud and IoT. Learn it, build it, compete with it. Dig in.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => jump('about')} className="btn-primary text-sm uppercase tracking-wideish">Start digging ↓</button>
                <button onClick={() => jump('join')} className="btn-secondary text-sm uppercase tracking-wideish !bg-transparent !text-[#1F1B24]">Skip to joining</button>
              </div>
            </div>
            <div className="lg:col-span-4 hidden md:block">
              <AsciiArt className="text-[10px] lg:text-xs text-[#1F1B24]" />
              <p className="mt-3 font-mono text-label uppercase opacity-70">↑ click the earth to rebuild it</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 -mx-4 sm:-mx-6">
          <p className="text-center font-mono text-label uppercase pb-3">scroll to go deeper <span className="bob">↓</span></p>
          <div className="ground" />
        </div>
      </section>

      {/* 01 TOPSOIL */}
      <Layer id="about" index={1} decos={<><Deco k={0.12} className="left-[3%] top-24 text-5xl">🌱</Deco><Deco k={-0.1} className="right-[5%] bottom-24 text-5xl">🪱</Deco></>}>
        <SectionHeader index={1} label="Topsoil" title="Where it starts" sub="Who we are, what we believe, and what we do every week." />
        <div className="grid md:grid-cols-2 gap-px bg-current/30 border border-current/40">
          <Reveal className="wreck bg-dark-950/70 p-8 sm:p-10 space-y-4 backdrop-blur-sm">
            <p className="font-mono text-label uppercase text-cyan-400">Mission</p>
            <p className="text-slate-300 leading-relaxed text-lg">Code2Chill is a student-led technical club that fosters innovation, technical excellence and practical learning. We bridge the gap between academic learning and industry requirements through workshops, coding competitions, hackathons, technical talks, project-building sessions and skill-development programs.</p>
          </Reveal>
          <Reveal className="wreck bg-dark-950/70 p-8 sm:p-10 space-y-4 backdrop-blur-sm" delay={0.1}>
            <p className="font-mono text-label uppercase text-cyan-400">Vision</p>
            <p className="text-slate-300 leading-relaxed text-lg">A vibrant technical community built on continuous learning, creativity and professional growth, where students collaborate to solve real-world problems while building leadership, teamwork and problem-solving skills, and gain the confidence to excel in a fast-changing tech world.</p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-current/40 divide-x divide-y lg:divide-y-0 divide-current/40">
          {statCards.map((s) => (
            <Reveal key={s.label} className="wreck p-6 sm:p-8">
              <div className="font-display text-5xl sm:text-7xl font-extrabold tabular-nums"><CountUp to={s.n} suffix="+" /></div>
              <div className="font-mono text-label uppercase mt-3 opacity-80">{s.label}</div>
            </Reveal>
          ))}
        </div>
        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHAT.map((w) => (
            <div key={w.title} className="wreck group h-full border border-current/40 p-6 space-y-4 bg-dark-950/60 backdrop-blur-sm transition-all duration-500 ease-expo hover:-translate-y-1 hover:border-brand-orange">
              <w.icon className="w-7 h-7 text-cyan-400" />
              <h3 className="font-display text-xl font-extrabold uppercase text-white">{w.title}</h3>
              <p className="text-sm text-slate-300">{w.text}</p>
            </div>
          ))}
        </StaggerGrid>
      </Layer>

      {/* 02 ROOTS */}
      <Layer id="domains" index={2} decos={<>
        <svg className="deco left-0 top-0 h-full w-24 opacity-50" style={{ ['--k' as any]: 0.05 }} viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 C60 120 10 220 70 340 S20 560 80 800" stroke="#D9B27C" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
        <svg className="deco right-0 top-0 h-full w-24 opacity-50" style={{ ['--k' as any]: 0.08 }} viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true"><path d="M100 0 C40 160 90 260 30 400 S80 600 20 800" stroke="#D9B27C" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
      </>}>
        <SectionHeader index={2} label="Roots" title="Six domains, one community" sub="Pick the wing that fits your curiosity. Beginners welcome in every one." />
        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{domains.map((d) => <DomainCard key={d.id} domain={d} />)}</StaggerGrid>
      </Layer>

      {/* 03 BEDROCK */}
      <Layer id="events" index={3} decos={<><TearZone kind="magma" /><Deco k={0.18} className="left-[4%] top-16 text-6xl">🦴</Deco><Deco k={-0.12} className="right-[6%] top-1/2 text-6xl">🐚</Deco></>}>
        <SectionHeader index={3} label="Bedrock" title="Events & hackathons" sub="Workshops, contests and our flagship hackathon. Tap an event to register." />
        {events.length === 0 ? <p className="font-mono text-sm uppercase">Events will be announced soon.</p> : <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{events.map((e) => <EventCard key={e._id} event={e} />)}</StaggerGrid>}
      </Layer>

      {/* 04 CRYSTAL CAVES */}
      <Layer id="projects" index={4} decos={<><TearZone kind="void" /><Deco k={0.2} className="left-[5%] top-20 text-6xl">💎</Deco><Deco k={-0.15} className="right-[7%] top-32 text-5xl">🦇</Deco><Deco k={0.3} className="right-[15%] bottom-20 text-6xl">💎</Deco></>}>
        <SectionHeader index={4} label="Crystal Caves" title="Built & cooking" sub="Finished gems and projects still being mined." />
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(counts).map(([name, n]) => (
            <button key={name} onClick={() => setTab(name)} className={chip(tab === name)} aria-pressed={tab === name}>{name} ({n})</button>
          ))}
          {user ? (
            <button onClick={() => setModal(true)} className={`${chip(false)} inline-flex items-center gap-2`}><Plus className="w-3.5 h-3.5" /> Submit project</button>
          ) : (
            <Link to="/login?redirect=/" className={chip(false)}>Sign in to submit</Link>
          )}
        </div>
        {shownProjects.length === 0 ? <p className="font-mono text-sm uppercase">No projects here yet. Be the first.</p> : <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{shownProjects.map((p) => <ProjectCard key={p._id} project={p} />)}</StaggerGrid>}
        <SubmitProjectModal isOpen={modal} onClose={() => setModal(false)} onProjectCreated={loadProjects} />
      </Layer>

      {/* 05 AQUIFER */}
      <Layer id="team" index={5} decos={<><Deco k={0.15} className="left-[4%] top-24 text-6xl">💧</Deco><Deco k={-0.2} className="right-[5%] top-1/3 text-5xl">🐟</Deco></>}>
        <SectionHeader index={5} label="Aquifer" title="The crew" sub="Club heads, domain leads and core members. Flip a card to learn more." />
        {heads.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-mono text-label uppercase flex items-center gap-2 border-b border-current/40 pb-3"><Crown className="w-4 h-4 text-amber-400" /> Club heads</h3>
            <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{heads.map((m, i) => <MemberCard key={m._id} member={m} index={i} />)}</StaggerGrid>
          </div>
        )}
        {others.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-mono text-label uppercase border-b border-current/40 pb-3">Domain leads &amp; core members</h3>
            <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{others.map((m, i) => <MemberCard key={m._id} member={m} index={i + heads.length} />)}</StaggerGrid>
          </div>
        )}
        {team.length === 0 && <p className="font-mono text-sm uppercase">Team members will appear here.</p>}
      </Layer>

      {/* 06 MANTLE */}
      <Layer id="goals" index={6} decos={<><Deco k={0.2} className="left-[5%] top-24 text-6xl">🔥</Deco><Deco k={-0.15} className="right-[6%] top-1/2 text-7xl">🌋</Deco></>}>
        <SectionHeader index={6} label="Mantle" title="Goals & roadmap" sub="What we are aiming for and how we plan to get there." />
        <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{content.goals.map((g, i) => <GoalCard key={g.id} goal={g} index={i} />)}</StaggerGrid>
        <ol className="grid md:grid-cols-2 lg:grid-cols-4 border border-current/40 divide-y md:divide-y-0 md:divide-x divide-current/40">
          {content.roadmap.map((r) => (
            <Reveal key={r.id} className={`wreck p-6 space-y-4 bg-dark-950/70 backdrop-blur-sm ${r.status === 'current' ? 'outline outline-2 -outline-offset-2 outline-brand-orange' : ''}`}>
              <div className="flex items-center justify-between font-mono text-label uppercase">
                <span className="text-slate-400">{r.phase}</span>
                <span className={r.status === 'done' ? 'text-emerald-400' : r.status === 'current' ? 'text-cyan-400' : 'text-slate-500'}>{r.status === 'done' ? 'Done' : r.status === 'current' ? 'Now' : 'Next'}</span>
              </div>
              <h3 className="font-display text-2xl font-extrabold uppercase text-white">{r.title}</h3>
              <ul className="space-y-2">
                {r.items.map((it: string) => (
                  <li key={it} className="flex gap-2 text-sm text-slate-300">
                    {r.status === 'done' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" /> : <Circle className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />}
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </Layer>

      {/* 07 CORE */}
      <Layer id="join" index={7} className="!pb-20" decos={<div className="deco core-orb left-1/2 -top-44 w-80 h-80 rounded-full -translate-x-1/2 opacity-80" style={{ ['--k' as any]: -0.1 }} aria-hidden="true" />}>
        <SectionHeader index={7} label="The Core" title="You made it" sub="This is where the heat is. Join the club below, or drop us a message." />
        <div><button onClick={confetti} className="btn-primary text-sm uppercase tracking-wideish"><PartyPopper className="w-4 h-4 mr-2" /> Celebrate</button></div>
        <Reveal className="wreck border border-current/40 bg-dark-950/85 backdrop-blur-sm"><JoinUs /></Reveal>
        <Reveal className="wreck border border-current/40 bg-dark-950/85 backdrop-blur-sm"><div id="contact"><Contact /></div></Reveal>
      </Layer>
    </div>
  );
};

export default Home;
