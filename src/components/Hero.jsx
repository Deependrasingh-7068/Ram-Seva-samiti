import { Link } from 'react-router-dom';
import { HeartHandshake, MessageCircle } from 'lucide-react';

export default function Hero() {
  
  // Aapka WhatsApp Group Link
  const whatsappGroupLink = "https://chat.whatsapp.com/Iy1QEIDTSDQ686Iuy4UMh8";

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-navy pt-28 pb-20 overflow-hidden">
      {/* Background Ram Mandir Image with Blue Fade Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
        style={{ backgroundImage: `url('https://res.cloudinary.com/dp2fkeyok/image/upload/v1787346508/nddusvge44uofhrls8qs.png')` }}
      />
      {/* Navy Gradient Overlay for Blue Tone & Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/70 to-navy pointer-events-none" />

      {/* Background glow / decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
        {/* LOGO IMAGE */}
        <div className="flex justify-center mb-6">
          <img 
            src="/assets/gallery/ram_lineart_transparent.png" 
            alt="Ram Sewa Samiti Logo" 
            className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-full border-2 border-gold/40 shadow-xl bg-navy/50 backdrop-blur-sm"
          />
        </div>

        <p className="font-hindi text-gold text-lg md:text-xl mb-3 tracking-wide drop-shadow">
          ॥ श्री राम ॥
        </p>

        {/* PREMIUM STYLED RAM SEWA SAMITI TEXT */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-[0.15em] mb-6 font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-gold to-saffron drop-shadow-[0_4px_16px_rgba(230,126,34,0.45)]">
          RAM SEWA SAMITI
        </h1>

        <div className="flex items-center justify-center gap-3 text-saffron font-hindi text-lg md:text-xl mb-6">
          <span>सेवा</span>
          <span className="text-gold/40">•</span>
          <span>संस्कार</span>
          <span className="text-gold/40">•</span>
          <span>समर्पण</span>
        </div>

        <p className="font-hindi text-cream/80 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
          समाज की सेवा, संस्कृति का संरक्षण और एक बेहतर कल का संकल्प।
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {/* Donate Button */}
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold transition-all shadow-lg hover:shadow-saffron/25"
          >
            <HeartHandshake size={19} />
            Donate Now
          </Link>

          {/* WhatsApp Group Button */}
          <a
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gold/40 text-cream hover:border-gold hover:text-gold transition-all bg-navy/40 backdrop-blur-sm"
          >
            <MessageCircle size={19} />
            Join WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}