import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, LogOut, Sun, Moon, Zap, ZapOff, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePrefs } from '../context/PrefsContext';

const LINKS = ['about', 'domains', 'events', 'projects', 'team', 'goals', 'join', 'contact'];

const iconBtn = 'p-2 border border-grid/40 bg-dark-900/60 text-slate-200 hover:text-cyan-400 hover:border-cyan-400 transition-colors duration-300 ease-expo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  // direction-aware: slides away when you scroll down, returns when you scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
  });
  const { user, logout, isAdmin } = useAuth();
  const { theme, motion: mo, toggleTheme, toggleMotion } = useTheme();
  const { sound, toggleSound } = usePrefs();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.key]);

  const logoutNow = () => { logout(); navigate('/'); setOpen(false); };

  const toggles = (
    <>
      <button onClick={toggleSound} className={iconBtn} aria-pressed={sound} aria-label="Toggle click sounds" title={sound ? 'Click sounds on' : 'Click sounds off'}>
        {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
      <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle light and dark theme">{theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</button>
      <button onClick={toggleMotion} className={iconBtn} aria-pressed={mo === 'on'} aria-label="Toggle animations">{mo === 'on' ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}</button>
    </>
  );

  return (
    <motion.header
      animate={{ y: hidden && !open ? '-100%' : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-grid/30 bg-dark-950/80 backdrop-blur-xl"
    >
      <div className="max-w-[82rem] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Link to="/#surface" onClick={() => setOpen(false)} className="group flex items-baseline gap-3">
          <span className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
            Code<span className="text-cyan-400">2</span>Chill
          </span>
          <span className="hidden sm:inline font-mono text-label uppercase text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">Recruiting open</span>
        </Link>

        <nav className="hidden xl:flex items-center" onMouseLeave={() => setHover(null)}>
          {LINKS.map((id) => (
            <Link key={id} to={`/#${id}`} onMouseEnter={() => setHover(id)} className="relative px-3 py-2 font-mono text-xs uppercase tracking-wideish text-slate-300 hover:text-white transition-colors duration-300">
              <span className="relative z-10 inline-block transition-transform duration-300 ease-expo hover:-translate-y-0.5">{id}</span>
              {hover === id && <motion.span layoutId="nav-underline" className="absolute left-3 right-3 bottom-1 h-px bg-cyan-400" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-2">
          {toggles}
          {user ? (
            <>
              {isAdmin && <Link to="/admin" className="px-3 py-2 border border-grid/40 font-mono text-xs uppercase tracking-wideish text-white hover:border-cyan-400">Admin</Link>}
              <button onClick={logoutNow} className={iconBtn} aria-label="Log out"><LogOut className="w-4 h-4" /></button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-2 font-mono text-xs uppercase tracking-wideish text-slate-300 hover:text-white">Sign in</Link>
          )}
          <Link to="/#join" className="btn-primary text-xs !py-2 !px-4 uppercase tracking-wideish">Join</Link>
        </div>

        <div className="flex xl:hidden items-center gap-2">
          {toggles}
          <button onClick={() => setOpen(!open)} className={iconBtn} aria-expanded={open} aria-label="Toggle menu">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="xl:hidden overflow-hidden border-t border-grid/30 bg-dark-950">
            <div className="px-4 py-4 grid grid-cols-2 gap-px bg-grid/20">
              {['surface', ...LINKS].map((id, i) => (
                <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-dark-950">
                  <Link to={`/#${id}`} onClick={() => setOpen(false)} className="block px-4 py-4 font-mono text-sm uppercase tracking-wideish text-white">
                    <span className="text-cyan-400 mr-2">{String(i).padStart(2, '0')}</span>{id}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-4 pb-4 flex gap-2">
              {user ? <button onClick={logoutNow} className="btn-secondary flex-1">Log out</button> : <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">Sign in</Link>}
              <Link to="/#join" onClick={() => setOpen(false)} className="btn-primary flex-1">Join</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
