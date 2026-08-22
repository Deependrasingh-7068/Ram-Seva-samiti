import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Image, Users, Calendar, HeartHandshake, FileText, Bell, Info, Shield, Menu, X, LogOut, LayoutDashboard, Phone, Award, AlertTriangle, ShieldCheck, Sparkles, CreditCard, Lock 
} from 'lucide-react';

const ADMIN_SECTIONS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Home', path: '/admin/home', icon: Home },
  { name: 'About', path: '/admin/about', icon: Info },
  { name: 'Seva', path: '/admin/seva', icon: HeartHandshake },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Gallery', path: '/admin/gallery', icon: Image },
  { name: 'Members', path: '/admin/members', icon: Users },
  { name: 'Updates', path: '/admin/updates', icon: Bell },
  { name: 'Donate', path: '/admin/donate', icon: HeartHandshake },
  { name: 'Privacy Policy', path: '/admin/privacy', icon: FileText },
  { name: 'Terms', path: '/admin/terms', icon: FileText },
  { name: 'Volunteer', path: '/admin/volunteer', icon: Users },
  { name: 'Manage Admins', path: '/admin/admins', icon: Shield },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState(() => {
    return JSON.parse(localStorage.getItem('adminInfo') || '{}');
  });

  const navigate = useNavigate();

  // SuperAdmin live update listener & Real-time Freeze Polling
  useEffect(() => {
    const handleAdminSync = (e) => {
      if (e.detail) {
        setAdminInfo(e.detail);
      } else {
        setAdminInfo(JSON.parse(localStorage.getItem('adminInfo') || '{}'));
      }
    };

    window.addEventListener('samiti_admin_updated', handleAdminSync);
    window.addEventListener('storage', handleAdminSync);

    // Background poll to check real-time freeze status from database
    const checkFreezeStatus = async () => {
      if (!adminInfo?.email && !adminInfo?.id) return;
      try {
        const res = await fetch('http://localhost:5000/api/admin-auth/list');
        const data = await res.json();
        if (data.success && Array.isArray(data.admins)) {
          const currentMe = data.admins.find(a => 
            a.email === adminInfo.email || a._id === adminInfo.id || a.id === adminInfo.id
          );
          if (currentMe && currentMe.isFrozen !== adminInfo.isFrozen) {
            const updated = { ...adminInfo, isFrozen: currentMe.isFrozen };
            localStorage.setItem('adminInfo', JSON.stringify(updated));
            setAdminInfo(updated);
          }
        }
      } catch (err) {
        // Ignore network errors during polling
      }
    };

    const interval = setInterval(checkFreezeStatus, 5000); // Check every 5 seconds

    return () => {
      window.removeEventListener('samiti_admin_updated', handleAdminSync);
      window.removeEventListener('storage', handleAdminSync);
      clearInterval(interval);
    };
  }, [adminInfo]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('adminInfo');
    setLogoutModalOpen(false);
    navigate('/');
  };

  const adminIdDisplay = adminInfo.adminId || adminInfo.id || 'SRSS-ADMIN';

  // Helper to mask sensitive ID, showing only the last 6 digits safely
  const formatMaskedId = (idStr) => {
    if (!idStr || idStr === 'NA') return 'NA';
    const cleanStr = String(idStr).trim();
    if (cleanStr.length <= 6) return cleanStr;
    const lastSix = cleanStr.slice(-6);
    return `******${lastSix}`;
  };

  const maskedIdDisplay = formatMaskedId(adminInfo.aadhaar);

  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col w-full relative">
      
      {/* ================= FROZEN / BLOCKED OVERLAY ================= */}
      {adminInfo.isFrozen && (
        <div className="fixed inset-0 z-[99999] bg-navy/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-navy-2 border border-red-500/50 p-8 rounded-3xl max-w-lg w-full shadow-2xl text-center space-y-5 animate-pulse">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <Lock size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display text-red-400 font-bold">Account Temporarily Frozen</h3>
              <p className="text-base text-cream font-hindi leading-relaxed font-semibold">
                "नियमों के अनुरूप न होने वाली गतिविधियों के कारण आपका खाता अस्थायी रूप से फ्रीज़ किया गया है।"
              </p>
              <p className="text-xs text-cream/60 pt-1">
                Your administrative privileges have been blocked by the SuperAdmin due to policy violations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('adminInfo');
                window.location.href = '/';
              }}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
            >
              Sign Out Now
            </button>
          </div>
        </div>
      )}

      {/* ================= ADMIN TOP NAVBAR ================= */}
      <header className="relative w-full bg-navy-2 border-b border-gold/15 px-6 py-3.5 flex items-center justify-between gap-4 z-50 shadow-2xl">
        
        {/* Left: Profile Picture, Name + Admin ID, & Email */}
        <div className="flex items-center gap-3.5 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-navy text-gold hover:bg-saffron hover:text-navy transition-all lg:hidden cursor-pointer"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Admin Profile Picture / Initial Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-saffron bg-navy flex items-center justify-center shrink-0 shadow-md">
            {adminInfo.photo ? (
              <img src={adminInfo.photo} alt={adminInfo.name || 'Admin'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-saffron font-display font-bold text-lg">
                {adminInfo.name ? adminInfo.name.charAt(0).toUpperCase() : 'A'}
              </span>
            )}
          </div>
          
          {/* Admin Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-display text-sm md:text-base font-bold text-cream tracking-wide">
                {adminInfo.name || 'Admin'}
              </span>
              
              {/* Admin ID just beside the Name */}
              <span className="text-xs font-mono font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded border border-gold/20">
                ID: {adminIdDisplay}
              </span>
            </div>
            
            {/* Email below Name & ID */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-cream/70 truncate max-w-[220px]">
                {adminInfo.email || ''}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Glowing Control Panel Banner */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden xl:flex items-center gap-3 pointer-events-none select-none">
          <div className="flex items-center gap-4 px-6 py-1.5 rounded-2xl bg-navy/90 border border-gold/30 shadow-[0_0_25px_rgba(230,126,34,0.18)] backdrop-blur-md">
            <div className="w-7 h-7 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center border border-saffron/30">
              <ShieldCheck size={16} />
            </div>

            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-gold"></span>
              <div className="flex flex-col items-center">
                <h1 className="font-display text-base font-extrabold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold to-saffron drop-shadow-[0_2px_8px_rgba(230,126,34,0.35)]">
                  Admin Control Panel
                </h1>
                <p className="text-[10px] font-hindi tracking-widest text-saffron/80 font-semibold -mt-0.5">
                  श्री राम सेवा समिति
                </p>
              </div>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent via-gold/50 to-gold"></span>
            </div>

            <Sparkles size={15} className="text-gold animate-pulse" />
          </div>
        </div>

        {/* Right: Contact, Masked ID, Designation & Sign Out */}
        <div className="flex items-center gap-3 z-10">
          <div className="hidden lg:flex flex-col items-end bg-navy px-3.5 py-2 rounded-xl border border-gold/20 text-xs text-cream/70 shadow-sm space-y-1">
            {/* First Row: Contact Number & Designation */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-cream/90 font-medium">
                <Phone size={13} className="text-saffron" />
                <span>{adminInfo.contact || 'NA'}</span>
              </div>

              <div className="w-px h-3.5 bg-gold/25"></div>

              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-saffron flex-shrink-0" />
                <span className="text-gold uppercase font-bold text-[11px] tracking-wide">
                  Administrator
                </span>
                
                <span className="font-hindi text-saffron font-bold text-xs ml-0.5">
                  (प्रशासक)
                </span>
              </div>
            </div>

            {/* Second Row: Masked ID (Last 6 digits visible) just below Contact */}
            {maskedIdDisplay !== 'NA' && (
              <div className="flex items-center gap-1.5 text-cream/80 text-[11px]">
                <CreditCard size={12} className="text-saffron" />
                <span className="text-cream/60">Aadhaar:</span>
                <span className="font-mono text-saffron tracking-wider font-semibold">
                  {maskedIdDisplay}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN BODY ================= */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* Sidebar */}
        <aside className={`w-72 shrink-0 bg-navy-2 border-r border-gold/15 flex flex-col transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden lg:flex'}`}>
          <div className="p-4 text-xs font-semibold text-gold/60 uppercase tracking-wider border-b border-gold/10 flex items-center justify-between">
            <span>Management Sections</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Live Sync"></span>
          </div>
          
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {ADMIN_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <NavLink
                  key={section.path}
                  to={section.path}
                  end={section.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-saffron text-navy shadow-lg font-semibold shadow-saffron/20' 
                        : 'text-cream/80 hover:bg-navy hover:text-cream'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{section.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-navy overflow-y-auto p-6 lg:p-8 w-full">
          <div className="w-full max-w-none">
            <Outlet />
          </div>
        </main>

      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-navy-2 border border-gold/25 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle size={28} />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-xl text-cream">Confirm Sign Out</h3>
              <p className="text-xs text-cream/70">
                Are you sure you want to log out from the Admin Management Panel?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs font-semibold hover:border-gold/50 transition-all cursor-pointer"
              >
                No, Keep Working
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}