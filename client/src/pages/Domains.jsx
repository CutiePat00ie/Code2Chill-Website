import React, { useState, useEffect } from 'react';
import { statsAPI } from '../services/api';
import { 
  Terminal, 
  Layout, 
  BrainCircuit, 
  ShieldCheck, 
  Cloud, 
  Cpu, 
  CheckCircle2, 
  Users, 
  FolderGit2, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  Terminal,
  Layout,
  BrainCircuit,
  ShieldCheck,
  Cloud,
  Cpu
};

const Domains = () => {
  const [domains, setDomains] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await statsAPI.getDomains();
        if (res.data.success) {
          setDomains(res.data.data);
          if (res.data.data.length > 0) {
            // Check hash in URL or default to first
            const hash = window.location.hash.replace('#', '');
            if (hash && res.data.data.some(d => d.id === hash)) {
              setActiveTab(hash);
            } else {
              setActiveTab(res.data.data[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching domains:', err);
      }
    };

    fetchDomains();
  }, []);

  const currentDomain = domains.find(d => d.id === activeTab) || domains[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Technical Wings & Roadmaps
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Specialized Engineering <span className="text-gradient">Domains</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          At Code2Chill, we organize our training, hackathons, and project teams across 6 core technical pillars. Explore the domain curricula, roadmaps, and toolchains below.
        </p>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 glass-panel rounded-2xl border border-slate-800 max-w-5xl mx-auto">
        {domains.map((dom) => {
          const IconComp = iconMap[dom.icon] || Terminal;
          const isActive = dom.id === activeTab;
          return (
            <button
              key={dom.id}
              onClick={() => {
                setActiveTab(dom.id);
                window.location.hash = dom.id;
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{dom.shortName || dom.title}</span>
            </button>
          );
        })}
      </div>

      {/* Domain In-Depth Focus View */}
      {currentDomain && (
        <div id={currentDomain.id} className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-10 relative overflow-hidden">
          
          {/* Top Banner Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                {(() => {
                  const IconComp = iconMap[currentDomain.icon] || Terminal;
                  return <IconComp className="w-7 h-7" />;
                })()}
              </div>
              <div>
                <span className="badge bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] mb-1">
                  Domain Lead: {currentDomain.lead}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {currentDomain.title}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-300 font-medium mt-1">
                  {currentDomain.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 bg-dark-950/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
              <div>
                <span className="text-slate-500 block text-[10px]">MEMBERS</span>
                <span className="font-bold text-white text-sm">{currentDomain.stats?.members || 100}+</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">PROJECTS</span>
                <span className="font-bold text-cyan-400 text-sm">{currentDomain.stats?.projects || 12}+</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">WORKSHOPS</span>
                <span className="font-bold text-purple-400 text-sm">{currentDomain.stats?.workshops || 8}+</span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Domain Overview</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentDomain.description}
            </p>
          </div>

          {/* Core Curriculum Tracks */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Curriculum & Learning Tracks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDomain.topics?.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-dark-950/70 border border-slate-800/80 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{topic}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Structured milestone projects, review sessions, and mentored labs.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Tooling */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Recommended Toolchain & Tech Stack</h3>
            <div className="flex flex-wrap gap-2.5">
              {currentDomain.technologies?.map((tech, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-dark-900 border border-slate-700/80 flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Domain Action Footer */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Interested in joining the <strong className="text-white">{currentDomain.title}</strong> wing?
            </p>
            <div className="flex items-center gap-3">
              <Link
                to={`/projects?domain=${encodeURIComponent(currentDomain.title)}`}
                className="btn-secondary text-xs py-2 px-4"
              >
                View {currentDomain.shortName} Projects
              </Link>
              <Link
                to="/join"
                className="btn-primary text-xs py-2 px-5"
              >
                Apply for this Domain
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* Grid of All Domains Overview */}
      <div className="space-y-6 pt-10 border-t border-slate-800/80">
        <h2 className="text-2xl font-bold text-white text-center">
          Compare All Technical Domains
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((dom) => {
            const IconComp = iconMap[dom.icon] || Terminal;
            return (
              <div
                key={dom.id}
                onClick={() => {
                  setActiveTab(dom.id);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-dark-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Lead: {dom.lead}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {dom.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {dom.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span>Explore Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Domains;
