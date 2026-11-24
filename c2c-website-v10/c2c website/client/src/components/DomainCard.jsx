import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, 
  Layout, 
  BrainCircuit, 
  ShieldCheck, 
  Cloud, 
  Cpu, 
  ArrowRight, 
  Users, 
  FolderGit2, 
  BookOpen 
} from 'lucide-react';

const iconMap = {
  Terminal,
  Layout,
  BrainCircuit,
  ShieldCheck,
  Cloud,
  Cpu
};

const DomainCard = ({ domain }) => {
  const IconComponent = iconMap[domain.icon] || Terminal;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-slate-800 hover:border-cyan-500/40 group relative overflow-hidden">
      
      {/* Background Gradient Glow */}
      <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${domain.color || 'from-cyan-500 to-blue-600'} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity duration-500`} />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-dark-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 group-hover:scale-105 transition-all duration-300">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400 bg-dark-900/80 px-2.5 py-1 rounded-md border border-slate-800">
            Lead: {domain.lead}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
          {domain.title}
        </h3>
        <p className="text-xs font-medium text-cyan-300/80 mt-1 mb-3">
          {domain.tagline}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
          {domain.description}
        </p>

        {/* Core Topics Checklist */}
        <div className="space-y-1.5 mb-5">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
            Key Learning Tracks:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {domain.topics?.slice(0, 3).map((topic, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-dark-900 text-slate-300 border border-slate-800"
              >
                • {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          {domain.technologies?.map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CTA & Stats */}
      <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            {domain.stats?.members || 100}+
          </span>
          <span className="flex items-center gap-1">
            <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
            {domain.stats?.projects || 10}+
          </span>
        </div>

        <Link
          to={`/domains#${domain.id}`}
          className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
        >
          Curriculum
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};

export default DomainCard;
