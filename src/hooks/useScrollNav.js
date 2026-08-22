import { useEffect, useState } from 'react';

/**
 * Returns true once the page has scrolled past `offset` pixels.
 * Used to switch the navbar into its "scrolled" (solid, compact) state.
 */
export default function useScrollNav(offset = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > offset);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return scrolled;
}
