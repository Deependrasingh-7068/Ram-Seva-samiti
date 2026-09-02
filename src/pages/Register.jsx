import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, XCircle, CalendarClock } from 'lucide-react';
import RamBackground from '../components/RamBackground';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);

  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.contactNumber || '',
    email: user?.email || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/registrations/active-campaign`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setCampaign(data.campaign); })
      .catch(() => {})
      .finally(() => setLoadingCampaign(false));
  }, []);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        mobile: user.contactNumber || f.mobile,
      }));
    }
  }, [user]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg('success');
      } else {
        setStatusMsg(data.message || 'Registration fail ho gayi. Kripya dobara try karein.');
      }
    } catch (err) {
      setStatusMsg('Kuch galat ho gaya. Kripya dobara try karein.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative pt-32 pb-24 bg-navy overflow-hidden min-h-screen">
      <RamBackground rows={4} cols={3} />
      <div className="relative max-w-lg mx-auto px-4 sm:px-6">
        <header className="text-center mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream mb-4">Registration</h1>
        </header>

        {loadingCampaign ? (
          <div className="premium-card rounded-2xl p-8 text-center text-cream/60 text-sm">Loading...</div>
        ) : !campaign ? (
          <div className="premium-card rounded-2xl p-8 text-center space-y-3">
            <CalendarClock size={40} className="text-gold mx-auto" />
            <h2 className="font-display text-xl text-cream">Abhi Koi Registration Active Nahi Hai</h2>
            <p className="text-sm text-cream/60">
              Jab bhi koi nayi registration khulegi, iski soochna website ke top banner par di jayegi.
            </p>
          </div>
        ) : statusMsg === 'success' ? (
          <div className="premium-card rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <CheckCircle2 size={48} className="text-green-400 mx-auto" />
            <h2 className="font-display text-2xl text-cream">Registration Safal Rahi!</h2>
            <p className="text-cream/60 text-sm">
              Aapka registration <span className="text-saffron font-semibold">{campaign.title}</span> ke liye ho gaya hai.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="premium-card rounded-2xl p-5 sm:p-6 md:p-8 space-y-6">
            <div className="text-center">
              <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 mb-3">
                {campaign.title}
              </span>
              <p className="text-cream/70 text-sm font-hindi">{campaign.bannerMessage}</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm text-cream/60 mb-2">Full Name</label>
              <input
                id="name" name="name" required
                value={form.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobile" className="block text-sm text-cream/60 mb-2">Mobile</label>
                <input
                  id="mobile" name="mobile" type="tel" required
                  value={form.mobile} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                  placeholder="10-digit number"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-cream/60 mb-2">Email</label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                  placeholder="Optional"
                />
              </div>
            </div>

            {statusMsg && statusMsg !== 'success' && (
              <p className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <XCircle size={16} className="shrink-0" /> {statusMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-saffron hover:bg-saffron-deep disabled:opacity-60 text-navy font-semibold transition-colors"
            >
              <UserPlus size={18} /> {submitting ? 'Submitting…' : 'Register Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}