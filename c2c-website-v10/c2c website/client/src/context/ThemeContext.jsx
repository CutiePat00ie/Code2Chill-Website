import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', motion: 'on', toggleTheme() {}, toggleMotion() {} });

const read = (key, fallback) => {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
};
const write = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable, ignore */ }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => read('c2c_theme', 'dark'));
  const [motion, setMotion] = useState(() =>
    read('c2c_motion', window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'off' : 'on')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    write('c2c_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motion);
    write('c2c_motion', motion);
  }, [motion]);

  const value = {
    theme,
    motion,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleMotion: () => setMotion((m) => (m === 'on' ? 'off' : 'on'))
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
