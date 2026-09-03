import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const REAPPEAR_DELAY_MS = 20000; // Close karne ke 20 second baad agli ad dikhegi

export default function AdPopup() {
  const [currentAd, setCurrentAd] = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const lastAdIdRef = useRef(null);
  const location = useLocation();

  // Admin/SuperAdmin/OfficeBearer panels mein ad kabhi nahi dikhegi
  const isRestrictedRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/superadmin') ||
    location.pathname.startsWith('/office-bearer');

  // Har baar taazi (latest) active ads list backend se fetch karta hai,
  // taaki Super Admin ne abhi-abhi activate/deactivate ki ho to wo turant reflect ho
  const fetchAndShowNextAd = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ads/active`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.ads) || data.ads.length === 0) {
        setCurrentAd(null);
        setVisible(false);
        return;
      }

      const list = data.ads;
      // Turn-by-turn: pichli dikhayi gayi ad ke baad wali agli ad chuno (list ke end pe pahunch kar wapas shuru se)
      const lastIndex = list.findIndex((a) => a._id === lastAdIdRef.current);
      const nextIndex = lastIndex === -1 ? 0 : (lastIndex + 1) % list.length;
      const nextAd = list[nextIndex];

      lastAdIdRef.current = nextAd._id;
      setCurrentAd(nextAd);
      setVisible(true);
    } catch (err) {
      // Silent fail — koi ad na dikhayein, site block na ho
    }
  };

  useEffect(() => {
    if (isRestrictedRoute) return;
    fetchAndShowNextAd();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRestrictedRoute]);

  const handleClose = () => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchAndShowNextAd, REAPPEAR_DELAY_MS);
  };

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, '_blank', 'noopener,noreferrer');
    }
  };

  if (!visible || !currentAd || isRestrictedRoute) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[90] animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="complementary"
      aria-label="Advertisement"
    >
      <div className="relative inline-block max-w-[240px] sm:max-w-[300px] rounded-2xl overflow-hidden shadow-2xl border border-gold/25 bg-navy-2">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close ad"
          className="absolute top-1.5 right-1.5 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-navy/90 border border-gold/30 text-cream/80 hover:text-cream hover:bg-navy transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>

        <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-semibold uppercase tracking-wider text-cream/70 bg-navy/80 px-1.5 py-0.5 rounded">
          Ad
        </span>

        <img
          src={currentAd.image}
          alt={currentAd.title || 'Advertisement'}
          onClick={handleAdClick}
          className={`block w-auto h-auto max-w-[240px] sm:max-w-[300px] max-h-[70vh] object-contain ${currentAd.link ? 'cursor-pointer' : ''}`}
        />
      </div>
    </div>
  );
}