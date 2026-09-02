import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, HeartHandshake } from 'lucide-react';

// Popup kitni der baad dikhega (milliseconds mein)
const SHOW_AFTER_MS = 15000; // 15 seconds

export default function VolunteerPopup() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Admin/SuperAdmin/OfficeBearer panels aur volunteer page par khud yeh popup nahi dikhega
  const isRestrictedRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/superadmin') ||
    location.pathname.startsWith('/office-bearer') ||
    location.pathname.startsWith('/volunteer');

  useEffect(() => {
    if (isRestrictedRoute) return;

    // Ek baar dismiss/apply karne ke baad isi browser session mein dobara nahi aayega
    const alreadySeen = sessionStorage.getItem('srss_volunteer_popup_seen');
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, SHOW_AFTER_MS);

    return () => clearTimeout(timer);
  }, [isRestrictedRoute]);

  const closePopup = () => {
    setVisible(false);
    sessionStorage.setItem('srss_volunteer_popup_seen', '1');
  };

  const handleApply = () => {
    closePopup();
    navigate('/volunteer');
  };

  if (!visible || isRestrictedRoute) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center px-4 bg-navy/70 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Become a Volunteer"
    >
      <div className="relative w-full max-w-sm bg-navy-2 border border-gold/25 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-5">
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-navy border border-gold/20 text-cream/60 hover:text-cream hover:border-gold/50 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-saffron/15 flex items-center justify-center">
          <HeartHandshake size={30} className="text-saffron" />
        </div>

        <div>
          <p className="font-hindi text-saffron text-sm mb-1">सेवा में जुड़ें</p>
          <h2 className="font-display text-2xl text-cream font-bold">Become a Volunteer</h2>
          <p className="text-sm text-cream/60 mt-2">
            Shri Ram Sewa Samiti ke saath judiye aur samaj seva mein apna yogdaan dijiye.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={closePopup}
            className="flex-1 py-3 rounded-full border border-gold/25 text-cream/80 hover:border-gold/50 hover:text-cream font-semibold text-sm transition-colors cursor-pointer"
          >
            Not Now
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-bold text-sm shadow-lg transition-all cursor-pointer"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}