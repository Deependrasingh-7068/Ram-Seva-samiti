import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, KeyRound, Calendar, ArrowLeft, ShieldAlert } from 'lucide-react';
import axios from 'axios';

export default function OfficeBearerLogin() {
  const [loginId, setLoginId] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginId.trim() || !dob.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/office-bearers/login`, {
        loginId: loginId.trim(),
        dob: dob.trim()
      });

      if (res.data.success) {
        // Save session info in localStorage
        localStorage.setItem('officeBearerAuth', JSON.stringify({
          token: res.data.officeBearer._id,
          bearerInfo: res.data.officeBearer,
        //   expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8 hours session
        }));
        
        navigate('/office-bearer/panel');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute w-96 h-96 bg-saffron/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-gold/10 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none" />

      {/* Back to Home / Choice */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-cream/70 hover:text-saffron transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-navy-2 border border-gold/30 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-saffron/15 border border-saffron/40 flex items-center justify-center text-saffron shadow-inner">
            <Crown size={28} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-cream font-bold">
            Office Bearer Login
          </h1>
          <p className="font-hindi text-xs sm:text-sm text-gold/80">
            श्री राम सेवा समिति — पदाधिकारी नियंत्रण कक्ष
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-cream/80 block">
              Aadhaar Number / Bearer ID / Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gold/60">
                <KeyRound size={16} />
              </span>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter Aadhaar, ID or Email"
                className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-saffron rounded-xl text-cream text-sm outline-none transition-all placeholder:text-cream/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-cream/80 block">
              Date of Birth (DDMMYYYY)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gold/60">
                <Calendar size={16} />
              </span>
              <input
                type="text"
                required
                maxLength={8}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="e.g. 26052002"
                className="w-full pl-10 pr-4 py-3 bg-navy border border-gold/20 focus:border-saffron rounded-xl text-cream text-sm outline-none transition-all placeholder:text-cream/30 tracking-widest"
              />
            </div>
            <p className="text-[10px] text-cream/40 pl-1 font-hindi">कृपया अपनी जन्मतिथि DDMMYYYY फॉर्मेट में दर्ज करें</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-saffron to-amber-500 hover:from-amber-500 hover:to-saffron text-navy font-bold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <Crown size={16} />
                <span>Login as Office Bearer</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}