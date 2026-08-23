import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import settings from '../data/settings';
import { useAdmin } from '../context/AdminContext';

const FOOTER_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/seva', label: 'Seva' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/members', label: 'Members' },
  { to: '/updates', label: 'Updates' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const { myMembers = [] } = useAdmin();
  const activeMembers = myMembers.length > 0 ? myMembers : [];

  // Seamless loop ke liye sirf 2 bar duplicate kiya taaki extra copies na dikhein
  const marqueeMembers = [...activeMembers, ...activeMembers];

  // Google Maps search query link address ke liye
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  return (
    <footer className="relative bg-navy border-t border-gold/10 pt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-14">
        <div className="md:col-span-1">
          <p className="font-hindi text-xl text-gold mb-1">॥ श्री राम ॥</p>
          <h3 className="font-display text-2xl text-cream mb-3">Ram Sewa Samiti</h3>
          <p className="text-sm text-cream/60 font-hindi leading-relaxed">
            {settings.footerText}
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.15em] text-gold/80 mb-4">Navigate</h4>
          <ul className="space-y-2.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-cream/65 hover:text-saffron transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.15em] text-gold/80 mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-cream/65">
            <li>
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start gap-2 hover:text-saffron transition-colors group cursor-pointer"
              >
                <MapPin size={15} className="text-saffron mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{settings.address}</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-saffron shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-saffron transition-colors">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-saffron shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-saffron transition-colors">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.15em] text-gold/80 mb-4">Support Our Seva</h4>
          <p className="text-sm text-cream/60 mb-4">
            सेवा में सहयोग करें — आपका योगदान समाज की सेवा में सहायक होता है।
          </p>
          <Link
            to="/donate"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-saffron hover:bg-saffron-deep text-navy text-sm font-medium transition-colors"
          >
            Donate Now
          </Link>
          <div className="flex items-center gap-4 mt-6">
            <a href={settings.socialLinks.facebook} aria-label="Facebook" className="text-cream/50 hover:text-saffron transition-colors">
              <Facebook size={18} />
            </a>
            <a href={settings.socialLinks.instagram} aria-label="Instagram" className="text-cream/50 hover:text-saffron transition-colors">
              <Instagram size={18} />
            </a>
            <a href={settings.socialLinks.youtube} aria-label="YouTube" className="text-cream/50 hover:text-saffron transition-colors">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Samarpit Sadsya (Dedicated Members) Marquee Strip */}
      {activeMembers.length > 0 && (
        <div className="border-t border-gold/10 py-8 bg-navy-2/40 relative overflow-hidden">
          <p className="text-center font-hindi text-lg text-gold mb-6 tracking-wide">हमारे समर्पित सदस्य</p>
          
          <div 
            className="w-full overflow-hidden relative flex"
            style={{
              maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)'
            }}
          >
            <div className="flex w-max animate-marquee motion-reduce:animate-none items-center gap-12 pl-[100%]">
              {marqueeMembers.map((m, i) => {
                const memberName = m.nameHindi || m.name || m.title || 'सक्रिय सदस्य';
                const memberPhoto = m.photo || m.image || '/avatar.png';
                return (
                  <div 
                    key={`${m._id || m.id || i}-${i}`} 
                    className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 shadow-md bg-navy group-hover:border-saffron transition-colors">
                      <img src={memberPhoto} alt={memberName} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-xs text-cream/80 font-hindi font-medium tracking-wide max-w-[90px] truncate group-hover:text-saffron transition-colors text-center">
                      {memberName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gold/10 py-6 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© 2026 Ram Sewa Samiti. Made with ❤️ for Seva.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-saffron transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-saffron transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}