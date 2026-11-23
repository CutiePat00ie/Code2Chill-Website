import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Users, 
  Trophy, 
  Cpu, 
  ShieldCheck, 
  BrainCircuit, 
  Layout, 
  Cloud, 
  Calendar, 
  FolderGit2, 
  ChevronRight,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import { eventsAPI, projectsAPI, statsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import ProjectCard from '../components/ProjectCard';
import DomainCard from '../components/DomainCard';
import AnnouncementBanner from '../components/AnnouncementBanner';

const Home = () => {
  const [stats, setStats] = useState({
    activeMembers: 680,
    eventsOrganized: 38,
    innovativeProjects: 46,
    techDomains: 6,
    hackathonsWon: 19
  });
  const [domains, setDomains] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, domainsRes, eventsRes, projectsRes] = await Promise.all([
          statsAPI.getStats(),
          statsAPI.getDomains(),
          eventsAPI.getEvents({ status: 'upcoming' }),
          projectsAPI.getProjects({ featured: true })
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (domainsRes.data.success) setDomains(domainsRes.data.data);
        if (eventsRes.data.success) setUpcomingEvents(eventsRes.data.data.slice(0, 3));
        if (projectsRes.data.success) setFeaturedProjects(projectsRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-24">
      <AnnouncementBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
        
        {/* Cyber Neon Glow Circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Premier Student-Led Technical Club</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Where Innovation Meets Code &{' '}
                <span className="text-gradient">Creativity Chills.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Code2Chill (C2C) empowers student engineers to master modern technology, bridge the gap between academia and industry, and build high-impact real-world systems.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/events" className="btn-primary text-base py-3 px-6 shadow-xl shadow-cyan-500/25">
                  <Rocket className="w-5 h-5 mr-2" />
                  Explore Events & Hackathons
                </Link>
                <Link to="/join" className="btn-secondary text-base py-3 px-6">
                  Join Code2Chill
                  <ArrowRight className="w-4 h-4 ml-2 text-cyan-400" />
                </Link>
              </div>

              {/* Mini Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{stats.activeMembers}+</div>
                  <div className="text-xs text-slate-400">Active Members</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">{stats.eventsOrganized}+</div>
                  <div className="text-xs text-slate-400">Events & Bootcamps</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">{stats.innovativeProjects}+</div>
                  <div className="text-xs text-slate-400">Student Projects</div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Code Terminal Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
                
                {/* Terminal Header */}
                <div className="bg-dark-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    c2c-core@innovation:~$
                  </span>
                  <div className="w-12" />
                </div>

                {/* Terminal Body */}
                <div className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed space-y-3 bg-dark-950/90 text-slate-300">
                  <div className="text-slate-500">
                    // Welcome to Code2Chill Technical Platform
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold">$</span> c2c init --mission
                  </div>
                  <div className="p-3 rounded-lg bg-dark-900/80 border border-slate-800/80 text-slate-300 space-y-1.5">
                    <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Mission Status: Bridging Academia & Industry
                    </div>
                    <div className="text-slate-400 text-xs">
                      "Dedicated to fostering technical excellence, practical problem-solving, and peer collaboration across emerging technologies."
                    </div>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold">$</span> c2c domains --list
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <span className="text-indigo-400">1. Software Dev</span>
                    <span className="text-cyan-400">2. Web & Mobile</span>
                    <span className="text-purple-400">3. AI & ML</span>
                    <span className="text-rose-400">4. Cybersecurity</span>
                    <span className="text-amber-400">5. Cloud & DevOps</span>
                    <span className="text-emerald-400">6. IoT & Hardware</span>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Ready for next hackathon sprint.
                  </div>
                </div>

                {/* Terminal Footer */}
                <div className="bg-dark-900/90 px-4 py-2.5 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Branch: <strong className="text-cyan-400">main</strong></span>
                  <span>Stack: <strong className="text-slate-200">MERN + AI + Cloud</strong></span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Club Mission & Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              The C2C Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Bridging Academic Theory with Real-World Industry Practice
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Code2Chill is designed as an incubator for future engineers, researchers, and tech leaders. We believe the deepest learning occurs when students build genuine software, fail fast in safe environments, participate in hackathons, and share insights openly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 mt-8 border-t border-slate-800/80">
            <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Hands-On Sprints</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Workshops where participants write production code, deploy containers, and program actual microcontrollers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Hackathons & CTFs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fast-paced competitions that ignite creativity, teamwork, rapid prototyping, and resilience under deadline pressures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Peer Mentorship</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Senior students and industry alumni mentor newcomers, reviewing code, guiding career roadmaps, and providing referrals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Technical Domains Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
              Specialized Wings
            </span>
            <h2 className="text-3xl font-black text-white">
              Explore Our Technical Domains
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Find your passion across 6 cutting-edge engineering disciplines.
            </p>
          </div>
          <Link
            to="/domains"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View All Domain Roadmaps
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} />
          ))}
        </div>
      </section>

      {/* Upcoming Flagship Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="badge bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-2">
              Join The Action
            </span>
            <h2 className="text-3xl font-black text-white">
              Upcoming Events & Hackathons
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Register now for workshops, coding battles, and our 36-hour flagship hackathon.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Browse All Events ({upcomingEvents.length})
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>

      {/* Featured Student Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="badge bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 mb-2">
              Student Inventions
            </span>
            <h2 className="text-3xl font-black text-white">
              Featured Innovations & Projects
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Real systems built by Code2Chill student teams solving actual problems.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Explore Project Gallery
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>

      {/* Call To Action: Join C2C Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-cyan-950 via-dark-900 to-indigo-950 border border-cyan-500/30 text-center space-y-6 shadow-2xl shadow-cyan-500/10">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Recruitment 2026-27 Open
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Code, Collaborate, and Chill?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Whether you are a complete beginner eager to write your first line of code or an experienced builder looking for a hackathon squad, Code2Chill is your community.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/join" className="btn-primary text-base py-3 px-8 shadow-xl shadow-cyan-500/30">
              Apply For Membership
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link to="/contact" className="btn-secondary text-base py-3 px-6">
              Contact Club Leads
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
