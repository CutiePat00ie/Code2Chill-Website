import React, { useState } from 'react';
import { joinAPI } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Terminal, 
  Users, 
  Rocket 
} from 'lucide-react';

const JoinUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeId: '',
    year: '1st Year',
    branch: 'Computer Science & Engineering',
    domain: 'Software Development',
    experience: '',
    github: '',
    linkedin: '',
    whyJoin: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await joinAPI.submitApplication(formData);
      setSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Recruitment 2026-27
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Join <span className="text-gradient">Code2Chill</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Step into a community that builds real software, competes in hackathons, and levels up together. Fill out your details below to apply.
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/40 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Application Received!</h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
              Thank you, <strong className="text-cyan-400">{formData.name}</strong>. Your application to join Code2Chill's <strong className="text-purple-300">{formData.domain}</strong> wing has been submitted successfully.
            </p>
            <p className="text-xs text-slate-400">
              Our executive coordinators will review your responses and contact you via <span className="text-slate-200">{formData.email}</span> with interview and onboarding details.
            </p>
          </div>
          <div className="pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  collegeId: '',
                  year: '1st Year',
                  branch: 'Computer Science & Engineering',
                  domain: 'Software Development',
                  experience: '',
                  github: '',
                  linkedin: '',
                  whyJoin: ''
                });
              }}
              className="btn-secondary text-xs py-2 px-5"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / Student Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@student.edu"
                  className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Academic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Roll Number / College ID *</label>
                <input
                  type="text"
                  name="collegeId"
                  required
                  value={formData.collegeId}
                  onChange={handleChange}
                  placeholder="e.g. CS24B045"
                  className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department / Branch *</label>
                <input
                  type="text"
                  name="branch"
                  required
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="CSE, IT, ECE, AI&DS..."
                  className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Domain Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Domain Wing of Interest *
              </label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Software Development">Software Development (DSA, Systems, Low-Level)</option>
                <option value="Web & Mobile Development">Web & Mobile Development (React, Next.js, Flutter)</option>
                <option value="Artificial Intelligence & ML">Artificial Intelligence & ML (Deep Learning, NLP, LLMs)</option>
                <option value="Cybersecurity">Cybersecurity & Ethical Hacking (CTF, Forensics, Pentesting)</option>
                <option value="Cloud Computing">Cloud Computing & DevOps (Docker, K8s, AWS, CI/CD)</option>
                <option value="Internet of Things (IoT)">Internet of Things (IoT) & Smart Hardware (ESP32, Sensors)</option>
              </select>
            </div>

            {/* Social / Portfolio Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Profile Link</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/your-username"
                  className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn Profile Link</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Prior Coding / Technical Experience (if any)
              </label>
              <textarea
                name="experience"
                rows={2}
                value={formData.experience}
                onChange={handleChange}
                placeholder="Languages you know, past projects, hackathons attended, or self-taught topics..."
                className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Motivation Statement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Why do you want to join Code2Chill? *
              </label>
              <textarea
                name="whyJoin"
                required
                rows={3}
                value={formData.whyJoin}
                onChange={handleChange}
                placeholder="Tell us about your learning goals, what you hope to build, and how you want to contribute to the club..."
                className="w-full px-4 py-2.5 bg-dark-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Membership Application
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
};

export default JoinUs;
