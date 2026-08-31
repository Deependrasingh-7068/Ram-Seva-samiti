import { useState, useEffect } from 'react';
import RamBackground from '../components/RamBackground';
import useScrollReveal from '../hooks/useScrollReveal';

const VALUES = [
  { title: 'सेवा', englishTitle: 'Seva', desc: 'निःस्वार्थ सेवा हमारे हर कार्य का केंद्र है।' },
  { title: 'संस्कार', englishTitle: 'Sanskar', desc: 'परंपरा और मूल्यों को अगली पीढ़ी तक पहुंचाना।' },
  { title: 'समर्पण', englishTitle: 'Samarpan', desc: 'समाज के प्रति पूर्ण निष्ठा और समर्पण भाव।' },
  { title: 'पारदर्शिता', englishTitle: 'Transparency', desc: 'हर दान और गतिविधि में पूर्ण पारदर्शिता।' },
];

function Section({ eyebrow, hindiTitle, englishTitle, children }) {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="reveal py-16 border-b border-gold/10 last:border-0">
      <p className="text-xs uppercase tracking-[0.2em] text-saffron mb-2">{eyebrow}</p>
      <h2 className="font-hindi text-2xl md:text-3xl text-cream mb-1">{hindiTitle}</h2>
      <p className="font-display text-base text-cream/50 italic mb-6">{englishTitle}</p>
      <div className="text-cream/70 leading-relaxed font-hindi text-lg space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function About() {
  const [officeBearers, setOfficeBearers] = useState([]);

  // Office Bearer panel se President ka data live fetch karna
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/office-bearers/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.officeBearers)) {
          setOfficeBearers(data.officeBearers);
        }
      })
      .catch(() => {});
  }, []);

  // Jo bhi Office Bearer ka designation "President" hai (aur frozen nahi hai), usi ko dikhao
  const presidentBearer = officeBearers.find(
    (b) => b.designation === 'President' && !b.isFrozen
  );

  // Agar Super Admin ne kisi ko President banaya hai toh uska naam use karo, nahi toh fallback default
  const presidentName = presidentBearer ? (presidentBearer.nameHindi || presidentBearer.nameEnglish) : "NA";
  const presidentRole = presidentBearer ? (presidentBearer.designationHindi || "अध्यक्ष") : "NA";

  return (
    <div className="pt-32 pb-20 bg-navy relative">
      <RamBackground rows={4} cols={3} />
      <div className="relative max-w-3xl mx-auto px-6">
        <header className="text-center mb-6">
          <p className="font-hindi text-2xl text-gold mb-2">॥ श्री राम ॥</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream">About Ram Sewa Samiti</h1>
        </header>

        <Section
          eyebrow="Who We Are"
          hindiTitle="समिति का परिचय"
          englishTitle="Samiti Introduction"
        >
          <p>
            राम सेवा समिति एक सामुदायिक संगठन है जो धार्मिक आस्था, सामाजिक सेवा और सांस्कृतिक
            संरक्षण के माध्यम से गांव और आसपास के क्षेत्र में एक सशक्त समाज के निर्माण हेतु
            प्रयासरत है।
          </p>
        </Section>

        <Section eyebrow="Our Story" hindiTitle="हमारा इतिहास" englishTitle="History">
          <p>
            स्थानीय श्रद्धालुओं के एक छोटे समूह द्वारा प्रारंभ हुई यह समिति आज सैकड़ों परिवारों
            को सेवा कार्यों से जोड़ चुकी है। वर्षों की निरंतर सेवा ने इसे क्षेत्र के सबसे
            भरोसेमंद सामाजिक संगठनों में स्थान दिलाया है।
          </p>
        </Section>

        <Section eyebrow="Our Purpose" hindiTitle="हमारा उद्देश्य" englishTitle="Mission">
          <p>
            धार्मिक गतिविधियों, शिक्षा, स्वास्थ्य और सामुदायिक सहयोग के माध्यम से समाज के हर वर्ग
            तक सेवा की पहुंच सुनिश्चित करना।
          </p>
        </Section>

        <Section eyebrow="Looking Ahead" hindiTitle="हमारा विजन" englishTitle="Vision">
          <p>
            एक ऐसा समाज बनाना जहां सेवा, संस्कार और समर्पण की भावना हर पीढ़ी में जीवंत रहे।
          </p>
        </Section>

        <section className="py-16 border-b border-gold/10">
          <p className="text-xs uppercase tracking-[0.2em] text-saffron mb-2">What Guides Us</p>
          <h2 className="font-hindi text-2xl md:text-3xl text-cream mb-8">हमारे मूल्य</h2>
          <div className="grid grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="premium-card rounded-xl p-5">
                <p className="font-hindi text-xl text-saffron">{v.title}</p>
                <p className="text-xs text-cream/50 mb-2">{v.englishTitle}</p>
                <p className="text-sm text-cream/70">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Section
          eyebrow="A Word From Our President"
          hindiTitle="अध्यक्ष का संदेश"
          englishTitle="Founder's Message"
        >
          <p>
            "सेवा ही सबसे बड़ा धर्म है। हमारी समिति का हर कार्यकर्ता इसी भावना के साथ समाज की
            सेवा में जुटा है। आपका सहयोग हमें और सशक्त बनाता है।"
          </p>
          <p className="text-sm text-cream/50 not-italic">
            — {presidentName}, {presidentRole}
          </p>
        </Section>

        <Section
          eyebrow="What We've Achieved"
          hindiTitle="सामुदायिक प्रभाव"
          englishTitle="Community Impact"
        >
          <p>
            दो दशकों की सेवा यात्रा में समिति ने हजारों परिवारों तक भोजन, शिक्षा सामग्री,
            स्वास्थ्य सुविधाएं और धार्मिक अनुष्ठानों की पहुंच सुनिश्चित की है।
          </p>
        </Section>
      </div>
    </div>
  );
}