import { useEffect, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Animates a number from 0 to `target` once the element scrolls into view.
 * Returns [ref, displayValue] — attach ref to the element you want observed.
 */
export default function useCounter(target, { duration = 1600 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(el);

          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, reducedMotion]);

  return [ref, value];
}
