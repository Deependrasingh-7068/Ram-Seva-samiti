import { useState } from 'react';
import { Bell, LogOut, ChevronDown } from 'lucide-react';

export default function AdminTopbar({ onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock Admin Details
  const adminInfo = {
    id: "ADM-108",
    name: "Deependra Singh",
    email: "admin@ramsewasamiti.org",
    contact: "+91 9876543210",
    designation: "President",
    designationHindi: "अध्यक्ष",
  };

  return (
    <header className="relative h-20 bg-navy-2 border-b border-gold/15 px-8 flex items-center justify-between sticky top-0 z-50 shadow-xl">
      {/* Left: Organization Logo & Name */}
      <div className="flex items-center gap-3 z-10">
        <div className="w-10 h-10 rounded-full bg-saffron/20 border border-saffron flex items-center justify-center text-saffron font-bold text-sm shadow-inner">
          राम
        </div>
        <span className="font-display text-lg md:text-xl text-cream tracking-wide hidden sm:inline-block">
          Ram Sewa Samiti
        </span>
      </div>

      {/* Center: Premium Admin Branding */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-gold"></span>
          <h1 className="font-display text-lg md:text-2xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-saffron uppercase drop-shadow-[0_2px_12px_rgba(230,126,34,0.3)]">
            Admin Portal
          </h1>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent via-gold/60 to-gold"></span>
        </div>
        <p className="text-[10px] font-hindi tracking-widest text-saffron/80 font-medium -mt-0.5">
          श्री राम सेवा समिति
        </p>
      </div>

      {/* Right: Notifications & Admin Profile */}
      <div className="flex items-center gap-4 z-10">
        {/* Notification Bell */}
        <button 
          type="button"
          className="p-2.5 rounded-full bg-navy border border-gold/20 text-cream hover:text-saffron transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron ring-2 ring-navy-2 animate-pulse"></span>
        </button>

        {/* Profile Trigger */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2.5 pr-3.5 py-1.5 rounded-full bg-navy border border-gold/20 hover:border-gold/50 transition-all cursor-pointer shadow-md"
          >
            <div className="w-8 h-8 rounded-full bg-saffron text-navy font-bold flex items-center justify-center text-sm shadow">
              {adminInfo.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-cream leading-tight">{adminInfo.name}</p>
              <p className="text-[10px] text-saffron font-medium">{adminInfo.designationHindi}</p>
            </div>
            <ChevronDown size={14} className={`text-cream/60 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-navy border border-gold/25 rounded-2xl shadow-2xl p-5 space-y-3 z-50 text-cream animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="border-b border-gold/15 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-saffron/15 text-saffron border border-saffron/20">
                  {adminInfo.id}
                </span>
                <h4 className="font-bold text-base text-cream mt-2">{adminInfo.name}</h4>
                <p className="text-xs text-cream/70">{adminInfo.email}</p>
              </div>

              <div className="text-xs space-y-2 text-cream/80 py-1">
                <p className="flex items-center gap-2">
                  <span className="text-saffron">📞</span> {adminInfo.contact}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-saffron">💼</span> {adminInfo.designation} ({adminInfo.designationHindi})
                </p>
              </div>

              <button 
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-sm"
              >
                <LogOut size={14} /> Sign out / Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}