import React, { useState } from 'react';
import { projectsAPI } from '../services/api';
import { X, Sparkles, Loader2, Code2, Github, Globe } from 'lucide-react';

const SubmitProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Software Development',
    description: '',
    techStack: '',
    github: '',
    liveDemo: '',
    authors: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Please provide title and description.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await projectsAPI.createProject(formData);
      if (onProjectCreated) onProjectCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-dark-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" />

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Showcase Your Project</h3>
              <p className="text-xs text-slate-400">Share your innovation with the Code2Chill community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-dark-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI Attendance Drone, Decentralized Identity"
              className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Domain *</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Software Development">Software Development</option>
                <option value="Web & Mobile Development">Web & Mobile Development</option>
                <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g. React, Python, Docker, PyTorch"
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="What does this project do? What problem does it solve?"
              className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repository Link</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo Link</label>
              <input
                type="url"
                name="liveDemo"
                value={formData.liveDemo}
                onChange={handleChange}
                placeholder="https://myproject.vercel.app"
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contributors / Authors</label>
              <input
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                placeholder="e.g. Aryan, Sneha, Rohan"
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Publish to Showcase
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SubmitProjectModal;
