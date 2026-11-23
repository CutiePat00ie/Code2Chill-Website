import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Linkedin, Twitter, Mail, MapPin, Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-slate-800/80 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                Code<span className="text-cyan-400">2</span>Chill
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Code2Chill (C2C) is a premier student-led technical club fostering innovation, technical excellence, and hands-on project culture across software engineering, AI/ML, cloud, cybersecurity, and IoT.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@code2chill.org"
                className="w-9 h-9 rounded-lg bg-dark-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Explore C2C
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/domains" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Technical Domains
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Project Showcase
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Core Council & Leads
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Domains */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Domains
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/domains#ai-ml" className="hover:text-cyan-400 transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/domains#web-mobile" className="hover:text-cyan-400 transition-colors">
                  Web & Mobile Dev
                </Link>
              </li>
              <li>
                <Link to="/domains#cybersecurity" className="hover:text-cyan-400 transition-colors">
                  Cybersecurity & CTF
                </Link>
              </li>
              <li>
                <Link to="/domains#cloud-devops" className="hover:text-cyan-400 transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link to="/domains#iot-robotics" className="hover:text-cyan-400 transition-colors">
                  IoT & Smart Hardware
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Campus */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Campus Headquarters
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Room 402, Student Innovation Block, Main Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>leads@code2chill.org</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/join"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Join Club Recruitment
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Code2Chill (C2C). Built by Students, For Students.</p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Support & Inquiries</Link>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> & Passion
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
