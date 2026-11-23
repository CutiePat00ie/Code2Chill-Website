import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import SubmitProjectModal from '../components/SubmitProjectModal';
import { 
  FolderGit2, 
  Search, 
  Plus, 
  Filter, 
  Sparkles, 
  Loader2, 
  Layers 
} from 'lucide-react';

const domainFilterList = [
  'All',
  'Software Development',
  'Web & Mobile Development',
  'Artificial Intelligence & ML',
  'Cybersecurity',
  'Cloud Computing',
  'Internet of Things (IoT)'
];

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDomain = searchParams.get('domain') || 'All';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getProjects({
        domain: selectedDomain !== 'All' ? selectedDomain : undefined,
        search: search.trim() || undefined
      });
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedDomain]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Student Innovations
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Project <span className="text-gradient">Showcase</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Explore production-grade open source projects, AI models, hardware telemetry systems, and web apps built by Code2Chill student teams.
        </p>
      </div>

      {/* Action and Filter Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-5">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Submit Project Button */}
          <div>
            {user ? (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="btn-primary text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Showcase Your Project
              </button>
            ) : (
              <div className="text-xs text-slate-400">
                Log in to submit your student project to the showcase.
              </div>
            )}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, tech stack, or author..."
              className="w-full pl-10 pr-20 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold hover:bg-cyan-500/30"
            >
              Search
            </button>
          </form>

        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Domain:
          </span>
          {domainFilterList.map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                setSearchParams(dom !== 'All' ? { domain: dom } : {});
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDomain === dom
                  ? 'bg-cyan-400 text-dark-950 font-bold shadow-md shadow-cyan-400/20'
                  : 'bg-dark-900 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading student projects...</p>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj._id} project={proj} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <FolderGit2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No projects matched your criteria. Be the first to submit a project in this domain!
          </p>
          <button
            onClick={() => {
              setSelectedDomain('All');
              setSearch('');
            }}
            className="btn-secondary text-xs py-2 px-4 mt-2"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Submission Modal */}
      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onProjectCreated={fetchProjects}
      />

    </div>
  );
};

export default Projects;
