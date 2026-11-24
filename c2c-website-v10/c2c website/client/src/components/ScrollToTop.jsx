import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTarget } from '../lib/scroll';

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { scrollToTarget(el); return; }
    }
    scrollToTarget(0, { immediate: true });
  }, [pathname, hash, key]);
  return null;
}
