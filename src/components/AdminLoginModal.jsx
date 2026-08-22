import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, CreditCard, AlertCircle, X, KeyRound } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose }) {
  const [aadhaar, setAadhaar] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Backend se demo admin credentials fetch karne ke liye
  const fillDemoAdmin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/demo-admin`);
      const data = await response.json();
      
      if (data.success && data.admin) {
        setAadhaar(data.admin.aadhaar || '');
        setDob(data.admin.dob || '');
      } else {
        alert('No admin found in database yet. Please create one via SuperAdmin first!');
      }
    } catch (err) {
      console.error('Error fetching demo admin:', err);
      alert('Could not fetch credentials from server.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar, dob }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        onClose();
        navigate('/admin');
      } else {
        setError(data.message || 'Your Aadhaar number is not registered here, Sorry');
      }
    } catch (err) {
      setError('Server error. Contact your senior.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm px-4">
      <div className="relative p-8 sm:p-10 rounded-3xl max-w-lg w-full bg-navy-2 border border-gold/20 shadow-2xl space-y-6 text-cream">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-cream/60 hover:text-saffron transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* Quick Demo Fill Button */}
        <div className="flex items-center justify-between bg-navy p-2.5 rounded-xl border border-gold/15 text-xs">
          <span className="flex items-center gap-1.5 text-saffron font-medium"><KeyRound size={14} /> Quick Demo Fill</span>
          <button 
            type="button" 
            onClick={fillDemoAdmin}
            className="px-2.5 py-1 rounded bg-saffron text-navy font-bold hover:bg-saffron-deep transition-all text-[11px] cursor-pointer"
          >
            Fill Credentials
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-saffron/10 border border-saffron/30 flex items-center justify-center text-saffron shadow-inner">
            <ShieldCheck size={30} />
          </div>
          <h2 className="font-display text-2xl text-cream tracking-wide">Samiti Admin Portal</h2>
          <p className="text-xs text-cream/60">
            Enter your Aadhaar Number and Date of Birth (e.g., 10032004) to login.
          </p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gold/80 ml-1">Aadhaar Number</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-3 text-gold/60" size={16} />
              <input 
                type="text" 
                placeholder="Enter Aadhaar number" 
                value={aadhaar} 
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gold/80 ml-1">Date of Birth (e.g., DDMMYYYY)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3 text-gold/60" size={16} />
              <input 
                type="text" 
                placeholder="Enter DOB as numbers (e.g. DDMMYYYY)"
                value={dob} 
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-xs outline-none focus:border-saffron font-mono"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-3 py-3 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold transition-all shadow-lg text-xs tracking-wide disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Verifying Credentials...' : 'Login to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}