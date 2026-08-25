import React from 'react';
import { X, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginChoiceModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/85 backdrop-blur-md px-4 animate-in fade-in duration-200">
      <div className="relative bg-navy-2 border border-gold/30 p-8 sm:p-10 rounded-3xl max-w-lg w-full shadow-2xl text-center space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-saffron/15 border border-saffron/40 flex items-center justify-center text-saffron shadow-inner">
            <span className="text-2xl">👑</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-cream font-bold">
            Admin Login
          </h2>
          <p className="font-hindi text-xs sm:text-sm text-gold/80">
            कृपया अपना लॉगिन प्रकार चुनें
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="h-[1px] w-16 bg-gold/30" />
          <span className="text-xs uppercase font-mono tracking-widest text-gold font-semibold">Login As</span>
          <div className="h-[1px] w-16 bg-gold/30" />
        </div>

        {/* Two Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          
          {/* Card 1: Super Admin */}
          <div className="bg-navy border border-gold/20 hover:border-gold/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all shadow-lg group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-display text-base text-cream font-bold">Super Admin</h3>
              <p className="font-hindi text-[11px] text-cream/60 leading-relaxed">
                पूर्ण नियंत्रण के लिए लॉगिन करें
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/superadmin/login');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Login as Super Admin</span>
            </button>
          </div>

          {/* Card 2: Office Bearer */}
          <div className="bg-navy border border-gold/20 hover:border-gold/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all shadow-lg group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron group-hover:scale-110 transition-transform">
                <UserCheck size={20} />
              </div>
              <h3 className="font-display text-base text-cream font-bold">Office Bearer</h3>
              <p className="font-hindi text-[11px] text-cream/60 leading-relaxed">
                पदाधिकारी के रूप में लॉगिन करें
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/office-bearer/login'); // Next step mein yeh page banayenge
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Login as Office Bearer</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}