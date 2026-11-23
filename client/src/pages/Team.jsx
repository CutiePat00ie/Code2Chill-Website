import React, { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';
import { 
  Users, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await teamAPI.getTeamMembers();
        if (res.data.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const filteredTeam = filter === 'All'
    ? team
    : filter === 'Executive'
    ? team.filter(m => m.domain.toLowerCase().includes('executive') || m.role.toLowerCase().includes('president'))
    : team.filter(m => !m.domain.toLowerCase().includes('executive'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge bg-purple-500/10 text-purple-300 border border-purple-500/30">
          Club Leadership
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Meet the <span className="text-gradient">Core Team</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          The passionate student coordinators, domain leads, and mentors driving innovation and community excellence at Code2Chill.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2">
        {['All', 'Executive', 'Domain Leads'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filter === tab
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white bg-dark-900 border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Team Members Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading leadership board...</p>
        </div>
      ) : filteredTeam.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeam.map((member) => (
            <div
              key={member._id}
              className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 group flex flex-col items-center text-center space-y-4"
            >
              {/* Photo with neon ring */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/40 p-0.5 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
              </div>

              {/* Name & Role */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-cyan-300">
                  {member.role}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  {member.year} • {member.domain}
                </p>
              </div>

              {/* Bio */}
              {member.bio && (
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 w-full justify-center">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-dark-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-dark-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-dark-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          No team members found in this category.
        </div>
      )}

    </div>
  );
};

export default Team;
