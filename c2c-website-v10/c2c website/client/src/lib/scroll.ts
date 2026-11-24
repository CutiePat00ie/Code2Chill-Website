// Shared helpers for the smooth-scroll engine (Lenis). Falls back to native scrolling when it is off.
export const scrollToTarget = (target: string | HTMLElement | number | null, opts: { immediate?: boolean } = {}) => {
  if (target === null) return;
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(target, { immediate: !!opts.immediate, duration: 1.6, easing: (x: number) => 1 - Math.pow(1 - x, 4) });
    return;
  }
  if (typeof target === 'number') { window.scrollTo(0, target); return; }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth' });
};

export const scrollVelocity = (): number => (window as any).__scrollVel || 0;
