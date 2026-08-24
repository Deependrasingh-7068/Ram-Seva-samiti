import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, KeyRound, User, AlertCircle, Loader2 } from 'lucide-react';

export default function SuperAdminLogin() {
  const [superAdminId, setSuperAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-auth/superadmin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ superAdminId, password }),
      });
      const data = await response.json();

      if (data.success) {
        const session = { token: data.token, expiresAt: Date.now() + 12 * 60 * 60 * 1000 };
        localStorage.setItem('superAdminAuth', JSON.stringify(session));
        navigate('/superadmin');
      } else {
        setError(data.message || 'Invalid Super Admin ID or Password.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-navy-2 border border-amber-400/25 rounded-3xl shadow-[0_0_40px_rgba(200,164,94,0.15)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 via-gold to-amber-600 flex items-center justify-center shadow-lg">
            <Crown size={30} className="text-navy" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-cream font-bold tracking-wide">Super Admin</h1>
            <p className="text-xs text-cream/60 font-hindi mt-1">श्री राम सेवा समिति — नियंत्रण केंद्र</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-cream/70 font-medium">Super Admin ID</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70" />
              <input
                type="text"
                required
                value={superAdminId}
                onChange={(e) => setSuperAdminId(e.target.value)}
                placeholder="Enter Super Admin ID"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-cream/70 font-medium">Password</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-navy border border-gold/20 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-300 via-gold to-amber-500 text-navy text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Crown size={16} />}
            {loading ? 'Verifying...' : 'Enter Super Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}