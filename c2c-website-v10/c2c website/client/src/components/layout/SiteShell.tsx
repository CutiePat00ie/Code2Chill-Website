import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { usePrefs } from '../../context/PrefsContext';
import Loader from './Loader';
import SmoothScroll from './SmoothScroll';
import GlassShatter from './GlassShatter';
import GridFrame from './GridFrame';
import ClickFX from './ClickFX';
import Interactions from '../Interactions';
import ScrollToTop from '../ScrollToTop';

// Global wrapper: intro loader, grid frame, click effects, smooth scroll progress, motion preferences.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { motion: mo } = useTheme();
  const { introSeen, markIntroSeen } = usePrefs();
  const [loading, setLoading] = useState(!introSeen);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  const done = useCallback(() => { setLoading(false); markIntroSeen(); }, [markIntroSeen]);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user" transition={mo === 'off' ? { duration: 0 } : undefined}>
      <AnimatePresence>{loading && <Loader key="loader" onDone={done} quick={mo === 'off'} />}</AnimatePresence>
      <motion.div className="fixed top-0 left-0 right-0 h-1 z-[10000] origin-left bg-gradient-to-r from-brand-orange via-brand-pink to-brand-violet" style={{ scaleX: progress }} />
      <SmoothScroll paused={loading} />
      <GridFrame />
      <ClickFX />
      <GlassShatter />
      <Interactions />
      <ScrollToTop />
      {children}
    </MotionConfig>
  );
}
