import { useState, useEffect } from 'react';
import { ShieldCheck, HeartHandshake } from 'lucide-react';
import DonationChips from '../components/DonationChips';
import RamBackground from '../components/RamBackground';
// 1. Import useAuth
import { useAuth } from '../context/AuthContext';

export default function Donate() {
  // Extract user from context (used to auto-fill the form if already logged in)
  const { user } = useAuth();

  const [amount, setAmount] = useState(501);
  const [customAmount, setCustomAmount] = useState('');
  
  // Optional bonus: Auto-fill name and email if the user is logged in!
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    mobile: user?.contactNumber || '', 
    email: user?.email || '' 
  });
  
  const [submitting, setSubmitting] = useState(false);

  // Keep form synced if user logs in while on this page
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

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend-only in this phase: a real submit creates a payment order
    // on the backend (Razorpay/Cashfree) and never trusts a client-side
    // "success" — see the Donation System section of the project brief.
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 900);
  };

  return (
    <div className="relative pt-32 pb-24 bg-navy overflow-hidden">
      <RamBackground rows={4} cols={3} />
      <div className="relative max-w-lg mx-auto px-6">
        <header className="text-center mb-10">
          <p className="font-hindi text-2xl text-saffron mb-2">सेवा में सहयोग करें</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">Donate</h1>
          <p className="text-cream/60 text-sm flex items-center justify-center gap-2">
            <ShieldCheck size={15} className="text-gold" />
            Secure, verified donations — every contribution is receipted.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="premium-card rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-cream/60 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="mobile" className="block text-sm text-cream/60 mb-2">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                value={form.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                placeholder="10-digit number"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-cream/60 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream placeholder:text-cream/30 focus:border-gold outline-none transition-colors"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <span className="block text-sm text-cream/60 mb-2">Amount</span>
            <DonationChips
              amount={amount}
              onSelect={(v) => {
                setAmount(v);
                setCustomAmount('');
              }}
              customAmount={customAmount}
              onCustomChange={setCustomAmount}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !finalAmount}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-saffron hover:bg-saffron-deep disabled:opacity-60 text-navy font-semibold transition-colors"
          >
            <HeartHandshake size={18} />
            {submitting ? 'Processing…' : `Donate ₹${(finalAmount || 0).toLocaleString('en-IN')} Securely`}
          </button>

          <p className="text-xs text-center text-cream/40">
            Payments are processed through a verified gateway. A digital receipt is
            generated only after payment verification.
          </p>
        </form>
      </div>
    </div>
  );
}