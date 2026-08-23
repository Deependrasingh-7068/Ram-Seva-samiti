import { MessageCircle } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function WhatsappBand() {
  const ref = useScrollReveal();
  
  // Aapka WhatsApp Group Link
  const whatsappGroupLink = "https://chat.whatsapp.com/Iy1QEIDTSDQ686Iuy4UMh8";

  return (
    <section className="relative bg-navy-2 py-16 md:py-20 border-y border-gold/10">
      <div ref={ref} className="reveal max-w-3xl mx-auto px-6 text-center">
        <p className="font-hindi text-2xl md:text-3xl text-saffron mb-3">हमसे जुड़ें</p>
        <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
          Join Our Community
        </h2>
        <p className="text-cream/70 mb-8">
          सेवा से जुड़ी सूचनाएं, कार्यक्रम अपडेट और सामुदायिक चर्चाओं के लिए हमारे व्हाट्सएप समूह से जुड़ें।
        </p>
        <a
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-medium transition-colors shadow-lg"
        >
          <MessageCircle size={18} />
          Join WhatsApp Community
        </a>
      </div>
    </section>
  );
}