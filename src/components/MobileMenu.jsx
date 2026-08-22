import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, MessageCircle, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  // Pull user and global setAuthOpen from context
  const { user, logout, setAuthOpen } = useAuth();
  
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
      className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
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
        <div className="flex items-center justify-between mb-10">
          <span className="font-hindi text-2xl text-gold">राम</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-cream hover:text-saffron transition-colors cursor-pointer"
          >
            <X size={26} />
          </button>
        </div>

        <ul className="flex flex-col gap-5 overflow-y-auto">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={(e) => {
                  // Intercept Donate or Volunteer if user is not logged in
                  if ((link.label === 'Donate' || link.label === 'Volunteer') && !user) {
                    e.preventDefault();
                    onClose();
                    setAuthOpen(true);
                  } else {
                    onClose();
                  }
                }}
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

        {user ? (
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="mt-auto mb-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gold/25 text-cream/85 cursor-pointer"
          >
            <LogOut size={18} />
            Sign out ({user.name || user.email.split('@')[0]})
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClose();
              setAuthOpen(true);
            }}
            className="mt-auto mb-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gold/25 text-cream/85 cursor-pointer"
          >
            <LogIn size={18} />
            Sign In
          </button>
        )}

        <a
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-medium shadow-lg transition-colors cursor-pointer"
        >
          <MessageCircle size={18} />
          Join WhatsApp Community
        </a>
      </div>
    </div>
  );
}