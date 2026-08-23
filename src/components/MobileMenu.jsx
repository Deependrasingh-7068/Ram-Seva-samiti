import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, MessageCircle, Crown } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/seva', label: 'Seva' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/members', label: 'Members' },
  { to: '/updates', label: 'Updates' },
  { to: '/donate', label: 'Donate' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/contact', label: 'Contact' },
];

export default function MobileMenu({ open, onClose }) {
  // Aapka WhatsApp Group Link
  const whatsappGroupLink = "https://chat.whatsapp.com/Iy1QEIDTSDQ686Iuy4UMh8";

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[110] lg:hidden transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div
        className="absolute inset-0 bg-navy/95 backdrop-blur-lg"
        onClick={onClose}
      />
      <div
        className={`relative h-full flex flex-col px-8 pt-6 pb-10 transition-transform duration-500 ${
          open ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
                <div className="flex items-center justify-between gap-3 mb-10">
          <span className="font-hindi text-lg sm:text-2xl text-gold truncate min-w-0">
            श्री राम सेवा समिति
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {/* SuperAdmin Button — Admin se zyada premium (gold gradient + Crown icon) */}
            <Link
              to="/superadmin"
              onClick={onClose}
              aria-label="Super Admin Panel"
              title="Super Admin Panel"
              className="inline-flex items-center gap-1.5 pl-2.5 pr-2.5 sm:pr-3.5 py-2 rounded-full bg-gradient-to-r from-amber-300 via-gold to-amber-500 border border-amber-200/60 text-navy shadow-[0_0_18px_rgba(200,164,94,0.45)] hover:shadow-[0_0_26px_rgba(200,164,94,0.65)] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Crown size={16} className="text-navy" />
              <span className="hidden sm:inline text-xs font-bold tracking-wide uppercase">
                Super Admin
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-cream hover:text-saffron transition-colors cursor-pointer"
            >
              <X size={26} />
            </button>
          </div>
        </div>

        <ul className="flex flex-col gap-5 overflow-y-auto">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `font-display text-3xl transition-colors ${
                    isActive ? 'text-saffron' : 'text-cream/85 hover:text-saffron'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <a
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-medium shadow-lg transition-colors cursor-pointer"
        >
          <MessageCircle size={18} />
          Join WhatsApp Community
        </a>
      </div>
    </div>
  );
}