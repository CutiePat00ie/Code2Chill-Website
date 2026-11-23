import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Target, 
  Lightbulb, 
  Users, 
  Rocket, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          About Code2Chill
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Empowering the Next Generation of <span className="text-gradient">Innovators.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          A vibrant campus community where students unite to transform curiosity into real-world technological solutions.
        </p>
      </div>

      {/* Core Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Code2Chill is a student-led technical club dedicated to fostering innovation, technical excellence, and practical learning among students. The club serves as a platform for students to explore various domains of technology, including software development, web and mobile application development, artificial intelligence and machine learning, cybersecurity, cloud computing, Internet of Things (IoT), and other emerging technologies.
          </p>
        </div>

        {/* Primary Objective */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Our Primary Objective</h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The primary objective of Code2Chill is to bridge the gap between academic learning and industry requirements by organizing workshops, coding competitions, hackathons, technical talks, project-building sessions, and skill-development programs. The club encourages students to collaborate, innovate, and apply their technical knowledge to solve real-world problems while developing leadership, teamwork, and problem-solving skills.
          </p>
        </div>

      </div>

      {/* 4 Core Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-white">The Four Pillars of C2C</h2>
          <p className="text-sm text-slate-400">
            Guided by principles that create tangible growth for every club member.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Practical Learning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Moving beyond textbook rote-learning into writing real code, configuring servers, and flashing firmware.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Innovation Culture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Encouraging novel ideas, unconventional thinking, and rapid prototyping in our student project lab.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Collaboration & Teamwork</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forming cross-disciplinary teams where designers, backend coders, and hardware hackers build together.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Leadership Development</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students to organize national hackathons, lead technical workshops, and mentor junior batches.
            </p>
          </div>
        </div>
      </div>

      {/* What We Do: Activities Breakdown */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="badge bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Our Activities
          </span>
          <h2 className="text-3xl font-black text-white">How Code2Chill Functions</h2>
          <p className="text-sm text-slate-400">
            Structured initiatives designed to take members from basic skills to industry-ready software engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Hands-On Workshops
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weekend bootcamps on Docker, Next.js, PyTorch, CTF ethical hacking, ESP32 microcontrollers, and modern Git workflows.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              National Hackathons
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organizing CodePulse and supporting teams traveling to national and international hackathon arenas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Technical Talks & AMA
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inviting engineers from FAANG, cutting-edge startups, and research institutions to discuss architecture and career paths.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Coding Competitions
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              SpeedCode algorithmic battles to prepare students for technical interviews and competitive programming contests.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Open Source Projects
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Building and maintaining community tools, campus automation bots, and participating in Hacktoberfest & GSoC.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Skill-Development Sprints
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guided 4-week learning cohorts where beginners receive milestone tasks and personalized feedback from leads.
            </p>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="text-2xl font-bold text-white">Want to be part of the Code2Chill journey?</h3>
        <p className="text-sm text-slate-400">Join our community or reach out to our executive council.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/join" className="btn-primary text-sm py-2.5 px-6">
            Apply to Join C2C
          </Link>
          <Link to="/team" className="btn-secondary text-sm py-2.5 px-6">
            Meet the Team
          </Link>
        </div>
      </div>

    </div>
  );
};

export default About;
