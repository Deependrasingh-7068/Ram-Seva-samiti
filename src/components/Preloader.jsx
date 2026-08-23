import { useEffect, useState } from 'react';

import useReducedMotion from '../hooks/useReducedMotion';

const STEPS = ['ॐ', 'श्री राम', 'RAM SEWA SAMITI', 'सेवा • संस्कार • समर्पण'];

/**
 * Fast, four-beat preloader. Each step swaps with a quick fade/scale,
 * then the whole overlay fades out and unmounts via onDone.
 * If prefers-reduced-motion is set, we skip straight to unmounting.
 */
export default function Preloader({ onDone }) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onDone?.();
      return;
    }

    const stepDuration = 480; // ms per beat — keeps the whole sequence under ~2s
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * stepDuration)
    );
    const exitTimer = setTimeout(() => setExiting(true), STEPS.length * stepDuration);
    const doneTimer = setTimeout(() => onDone?.(), STEPS.length * stepDuration + 500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [reducedMotion, onDone]);

  if (reducedMotion) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-navy transition-opacity duration-500 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <p
          key={step}
          className={`animate-fadeUp ${
            step === 2 ? 'font-body tracking-[0.3em] text-lg md:text-2xl text-gold' : 'font-hindi text-4xl md:text-6xl text-cream'
          } ${step === 3 ? 'text-base md:text-lg tracking-[0.35em] text-saffron font-body' : ''}`}
        >
          {STEPS[step]}
        </p>
        <div className="mt-8 mx-auto h-px w-24 diya-divider" />
      </div>
      <span className="sr-only">Loading Ram Sewa Samiti</span>
    </div>
  );
}
