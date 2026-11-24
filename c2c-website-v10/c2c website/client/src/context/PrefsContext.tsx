import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clickSound, onSound } from '../lib/sound';

interface Prefs { sound: boolean; introSeenOn: string }
interface PrefsCtx extends Prefs {
  toggleSound: () => void;
  playClick: () => void;
  markIntroSeen: () => void;
  introSeen: boolean;
}

const KEY = 'c2c_prefs';
const today = () => new Date().toISOString().slice(0, 10);

const load = (): Prefs => {
  try { return { sound: false, introSeenOn: '', ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { sound: false, introSeenOn: '' }; }
};

const Ctx = createContext<PrefsCtx>({ sound: false, introSeenOn: '', introSeen: false, toggleSound() {}, playClick() {}, markIntroSeen() {} });

// Saved in localStorage: click-sound toggle (off by default) and whether today's intro was already seen.
export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* storage unavailable */ }
  }, [prefs]);

  const toggleSound = useCallback(() => setPrefs((p) => { if (!p.sound) onSound(); return { ...p, sound: !p.sound }; }), []);
  const markIntroSeen = useCallback(() => setPrefs((p) => ({ ...p, introSeenOn: today() })), []);
  const playClick = useCallback(() => { if (prefs.sound) clickSound(); }, [prefs.sound]);

  const value = useMemo(() => ({ ...prefs, introSeen: prefs.introSeenOn === today(), toggleSound, playClick, markIntroSeen }), [prefs, toggleSound, playClick, markIntroSeen]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePrefs = () => useContext(Ctx);
