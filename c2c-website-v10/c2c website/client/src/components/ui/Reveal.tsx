import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, className = '', delay = 0, y = 32 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

const item = { hidden: { opacity: 0, y: 36, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } } };

export function StaggerGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-6% 0px' }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      {React.Children.map(children, (c) => (c ? <motion.div variants={item} className="h-full">{c}</motion.div> : null))}
    </motion.div>
  );
}
