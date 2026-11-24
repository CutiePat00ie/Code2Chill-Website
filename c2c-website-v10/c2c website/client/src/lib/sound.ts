// Tiny synthesized UI sounds via the Web Audio API (no asset files to ship).
let ctx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

const blip = (from: number, to: number, ms: number, type: OscillatorType, vol: number) => {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + ms / 1000);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + ms / 1000 + 0.02);
};

export const clickSound = () => blip(900 + Math.random() * 300, 180, 70, 'square', 0.04);
export const onSound = () => { blip(500, 900, 90, 'triangle', 0.07); setTimeout(() => blip(900, 1400, 90, 'triangle', 0.06), 90); };

// short paper-rip noise burst for the tear effect
export const ripSound = () => {
  const c = getCtx();
  if (!c) return;
  const len = Math.floor(c.sampleRate * 0.22);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 1800;
  const g = c.createGain();
  g.gain.value = 0.12;
  src.connect(f).connect(g).connect(c.destination);
  src.start();
};

// Chainsaw: sawtooth engine with a fast wobble, returns a function that stops it.
export const chainsawSound = (): (() => void) => {
  const c = getCtx();
  if (!c) return () => {};
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 72;
  const lfo = c.createOscillator();
  lfo.frequency.value = 27;
  const lg = c.createGain();
  lg.gain.value = 20;
  lfo.connect(lg).connect(osc.frequency);
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 950;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.08, c.currentTime + 0.08);
  osc.connect(f).connect(g).connect(c.destination);
  osc.start(); lfo.start();
  return () => {
    const t = c.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(Math.max(g.gain.value, 0.0002), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc.stop(t + 0.2); lfo.stop(t + 0.2);
  };
};

export const thudSound = () => blip(150, 40, 170, 'sine', 0.16);

// Glass breaking: a bright noise crash plus a few ringing pings.
export const glassSound = () => {
  const c = getCtx();
  if (!c) return;
  const len = Math.floor(c.sampleRate * 0.35);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 2800;
  const g = c.createGain();
  g.gain.value = 0.16;
  src.connect(f).connect(g).connect(c.destination);
  src.start();
  for (let i = 0; i < 6; i++) setTimeout(() => blip(2200 + Math.random() * 4200, 1500 + Math.random() * 1500, 220, 'sine', 0.025), i * 35 + Math.random() * 40);
};
