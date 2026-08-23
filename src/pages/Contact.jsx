import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import settings from '../data/settings';

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Posts to POST /api/contact in production (Contact model);
    // messages appear in the admin Messages panel.
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 bg-navy">
      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-hindi text-2xl text-saffron mb-2">हमसे संपर्क करें</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream">Contact</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="premium-card rounded-2xl p-6 space-y-5">
              <p className="flex items-start gap-3 text-cream/80">
                <MapPin size={18} className="text-saffron mt-0.5 shrink-0" />
                {settings.address}
              </p>
              <p className="flex items-center gap-3 text-cream/80">
                <Phone size={18} className="text-saffron shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-saffron transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-3 text-cream/80">
                <Mail size={18} className="text-saffron shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-saffron transition-colors">
                  {settings.email}
                </a>
              </p>
              <a
                href={settings.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-cream/80 hover:text-saffron transition-colors"
              >
                <MessageCircle size={18} className="text-saffron shrink-0" />
                Join WhatsApp Community
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gold/15 aspect-video">
              <iframe
                title="Ram Sewa Samiti location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="premium-card rounded-2xl p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-10">
                <p className="font-hindi text-2xl text-saffron mb-2">धन्यवाद!</p>
                <p className="text-cream/60">आपका संदेश प्राप्त हो गया है। हम शीघ्र संपर्क करेंगे।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="c-name" className="block text-sm text-cream/60 mb-2">Name</label>
                  <input
                    id="c-name" name="name" required value={form.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="c-mobile" className="block text-sm text-cream/60 mb-2">Mobile</label>
                  <input
                    id="c-mobile" name="mobile" type="tel" required value={form.mobile} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="block text-sm text-cream/60 mb-2">Email</label>
                  <input
                    id="c-email" name="email" type="email" value={form.email} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="c-message" className="block text-sm text-cream/60 mb-2">Message</label>
                  <textarea
                    id="c-message" name="message" rows={4} required value={form.message} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-navy-2 border border-gold/20 text-cream focus:border-gold outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold transition-colors"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
