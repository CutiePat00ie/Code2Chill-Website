import CoverArt from './CoverArt';
import React, { useState } from 'react';
import { projectsAPI } from '../services/api';
import { Github, ExternalLink, Heart, Tag, Users, Sparkles } from 'lucide-react';

const STATUS = {
  Active: ['Ongoing', 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'],
  'In Development': ['Ongoing', 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'],
  Completed: ['Completed', 'bg-purple-500/15 text-purple-400 border-purple-500/40'],
  Archived: ['Archived', 'bg-slate-500/15 text-slate-400 border-slate-500/40']
};

const ProjectCard = ({ project }) => {
  const [statusLabel, statusStyle] = STATUS[project.status] || STATUS.Active;
  const [likes, setLikes] = useState(project.likes || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    try {
      setLiked(true);
      setLikes(prev => prev + 1);
      await projectsAPI.likeProject(project._id);
    } catch (err) {
      console.error('Failed to like project:', err);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800 hover:border-cyan-500/30">
      
      {/* Project Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-dark-900">
        <CoverArt seed={project.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />

        {/* Top Featured Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="badge bg-dark-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            {project.domain}
          </span>
          {project.featured && (
            <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400 mr-1" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <span className={`badge border ${statusStyle}`}>{statusLabel}</span>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack?.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-slate-700/80"
            >
              {tech}
            </span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-dark-800 text-slate-500">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Authors & Links Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate max-w-[150px]">
            <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">
              {Array.isArray(project.authors) ? project.authors.join(', ') : 'C2C Innovators'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                liked
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-dark-800 text-slate-300 border-slate-700 hover:text-rose-400 hover:border-rose-500/30'
              }`}
              title="Like this project"
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likes}</span>
            </button>

            {/* GitHub */}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                title="View Code on GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {/* Live Demo */}
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;
