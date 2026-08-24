import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, ShieldCheck, Crown } from 'lucide-react';
import useScrollNav from '../hooks/useScrollNav';
import NotificationBell from './NotificationBell';
import AdminLoginModal from './AdminLoginModal';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/seva', label: 'Seva' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/members', label: 'Members' },
  { to: '/updates', label: 'Updates' },
  { to: '/donate', label: 'Donate' },
];

export default function Navbar({ menuOpen, onMenuToggle }) {
  const scrolled = useScrollNav(40);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Agar admin pehle se logged in hai (adminInfo localStorage mein hai),
  // to "Admin" button seedha /admin dashboard pe le jaaye — login modal na khule
  const handleAdminClick = () => {
    const savedAdmin = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    const isLoggedIn = savedAdmin && (savedAdmin.id || savedAdmin.adminId || savedAdmin.email);
    if (isLoggedIn) {
      navigate('/admin');
    } else {
      setAdminModalOpen(true);
    }
  };

  // Super Admin Click Handler: Laptop/Desktop aur Mobile dono ke liye session validate karega
     const handleSuperAdminClick = (e) => {
    e.preventDefault();
    try {
      const session = JSON.parse(localStorage.getItem('superAdminAuth') || 'null');
      const isValid = session && session.token && session.expiresAt > Date.now();

      if (isValid) {
        navigate('/superadmin');
      } else {
        navigate('/superadmin/login');
      }
    } catch (err) {
      navigate('/superadmin/login');
    }
  };

  // Check if the current user is viewing Admin Dashboard pages
  const isAdminDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/superadmin');

  // Aapka WhatsApp Group Link
  const whatsappGroupLink = "https://chat.whatsapp.com/Iy1QEIDTSDQ686Iuy4UMh8";

  return (
    <>
      <div
        className={`w-full transition-all duration-500 ${
          scrolled
            ? 'bg-navy/90 backdrop-blur-md border-b border-gold/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between"
          aria-label="Primary"
        >
          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <img 
              src="/assets/gallery/logo.png"
              alt="Ram Sewa Samiti Logo" 
              className="w-10 h-10 object-contain rounded-full border border-gold/30"
            />
            <span className="font-display text-lg md:text-xl tracking-wide text-cream group-hover:text-saffron transition-colors">
              श्री राम Sewa Samiti
            </span>
          </NavLink>

          {/* PUBLIC LINKS */}
          <ul className="hidden lg:flex items-center gap-6">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `relative text-sm tracking-wide transition-colors py-1 ${
                      isActive ? 'text-saffron' : 'text-cream/80 hover:text-cream'
                    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-saffron after:transition-all ${
                      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <NotificationBell />

            {/* Join WhatsApp Button - Hide ONLY inside Admin/SuperAdmin Dashboard */}
            {!isAdminDashboard && (
              <a
                href={whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-saffron hover:bg-saffron-deep text-navy text-sm font-medium transition-colors shadow-md"
              >
                <MessageCircle size={16} />
                Join WhatsApp
              </a>
            )}

            {/* SUPER ADMIN BUTTON — Updated with strict session check */}
            <button
              type="button"
              onClick={handleSuperAdminClick}
              className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full whitespace-nowrap bg-gradient-to-r from-amber-300 via-gold to-amber-500 border border-amber-200/60 text-navy shadow-[0_0_14px_rgba(200,164,94,0.4)] hover:shadow-[0_0_22px_rgba(200,164,94,0.6)] hover:scale-105 transition-all duration-300 text-xs md:text-sm font-bold cursor-pointer"
            >
              <Crown size={15} />
              <span className="hidden sm:inline">Super Admin</span>
            </button>

            {/* ADMIN BUTTON WITH GRADIENT */}
            <button
              type="button"
              onClick={handleAdminClick}
              className="inline-flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-gold/20 via-saffron/20 to-gold/30 border border-gold/40 text-saffron hover:border-saffron hover:from-saffron/30 hover:to-saffron/40 hover:text-cream transition-all duration-300 text-xs md:text-sm font-medium shadow-md cursor-pointer"
            >
              <ShieldCheck size={15} />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={onMenuToggle}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-md text-cream hover:text-saffron transition-colors"
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Admin Login Modal Component */}
      <AdminLoginModal 
        isOpen={adminModalOpen} 
        onClose={() => setAdminModalOpen(false)} 
      />
    </>
  );
}