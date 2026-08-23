import { Link } from 'react-router-dom';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import Hero from '../components/Hero';
import RamBackground from '../components/RamBackground';
import StatsCounter from '../components/StatsCounter';
import SevaCard from '../components/SevaCard';
import EventCard from '../components/EventCard';
import MemberCard from '../components/MemberCard';
import WhatsappBand from '../components/WhatsappBand';
import useScrollReveal from '../hooks/useScrollReveal';
import settings from '../data/settings';
import { useAdmin } from '../context/AdminContext';

function SectionHeading({ eyebrow, hindiTitle, englishTitle }) {
  return (
    <div className="text-center max-w-xl mx-auto mb-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-saffron mb-1 font-semibold">{eyebrow}</p>
      <h2 className="font-hindi text-2xl md:text-3xl text-cream mb-0.5 font-bold">{hindiTitle}</h2>
      <p className="font-display text-xs text-cream/50 italic">{englishTitle}</p>
    </div>
  );
}

function formatQuote(text) {
  if (!text) return '';
  const trimmed = text.trim().replace(/^["“']+|["”']+$/g, '');
  return `“${trimmed}”`;
}

export default function Home() {
  const { 
    seva = [], 
    events = [], 
    members = [], 
    gallery = [], 
    updates = [] 
  } = useAdmin();

  const aboutRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const sevaRef = useScrollReveal();
  const eventsRef = useScrollReveal();
  const donateRef = useScrollReveal();
  const membersRef = useScrollReveal();
  const galleryRef = useScrollReveal();
  const updatesRef = useScrollReveal();
  const volunteerRef = useScrollReveal();

  const featuredSeva = seva.filter((s) => s.featured).length > 0 
    ? seva.filter((s) => s.featured).slice(0, 3) 
    : seva.slice(0, 3);

  const upcomingEvents = events.filter((e) => (e.status || '').toLowerCase() === 'upcoming').length > 0
    ? events.filter((e) => (e.status || '').toLowerCase() === 'upcoming').slice(0, 3)
    : events.slice(0, 3);

  const previewGallery = gallery.slice(0, 6);
  const featuredUpdates = updates.slice(0, 3);

  // --- AUTOMATIC IST DAY-BASED THOUGHT LOGIC FOR FOOTER QUOTE ---
  const getDailyThought = () => {
    try {
      const thoughtsList = settings.dailyThoughts || [];
      if (thoughtsList.length === 0) return settings.dailyQuote;

      const options = { timeZone: 'Asia/Kolkata' };
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = (today - start) + ((start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000);
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);

      const index = (dayOfYear - 1) % thoughtsList.length;
      return thoughtsList[index >= 0 ? index : 0];
    } catch {
      return settings.dailyQuote;
    }
  };

  const todaysThought = getDailyThought();
  // -------------------------------------------------------------

  return (
    <>
      <Hero />

      {/* About Samiti preview */}
      <section className="relative py-14 bg-navy-2 overflow-hidden">
        <div ref={aboutRef} className="reveal relative max-w-2xl mx-auto px-6 text-center">
          <p className="font-hindi text-lg text-saffron mb-1.5 font-bold">हमारी सेवा यात्रा</p>
          <h2 className="font-display text-2xl md:text-3xl text-cream mb-3">
            Our Journey of Seva
          </h2>
          <p className="text-cream/70 leading-relaxed font-hindi text-sm">
            राम सेवा समिति एक ऐसा मंच है जहां श्रद्धा, संस्कार और समाज सेवा एक साथ मिलकर एक बेहतर
            कल की नींव रखते हैं। दो दशकों से अधिक समय से हम धार्मिक गतिविधियों, शिक्षा, स्वास्थ्य
            और सामुदायिक सहयोग के माध्यम से समाज को सशक्त बना रहे हैं।
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 mt-5 text-gold hover:text-saffron transition-colors font-medium text-xs"
          >
            Read Our Story
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Community statistics */}
      <section className="relative py-12 bg-navy">
        <RamBackground rows={2} cols={4} />
        <div
          ref={statsRef}
          className="reveal-stagger relative max-w-3xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
        >
          <StatsCounter value={2500} suffix="+" label="Community Members" />
          <StatsCounter value={120} suffix="+" label="Seva Activities" />
          <StatsCounter value={50} suffix="+" label="Events Organised" />
          <StatsCounter prefix="₹" value={5} suffix="L+" label="Contributions" />
        </div>
      </section>

      {/* Seva activities */}
      <section className="py-14 bg-navy-2">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            eyebrow="What We Do"
            hindiTitle="हमारी सेवा गतिविधियां"
            englishTitle="Our Seva Activities"
          />
          <div
            ref={sevaRef}
            className="reveal-stagger flex flex-wrap justify-center items-stretch gap-3.5 max-w-3xl mx-auto"
          >
            {featuredSeva.map((item) => (
              <div key={item._id || item.id} className="w-[235px] flex">
                <SevaCard {...item} />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/seva"
              className="inline-flex items-center gap-1 text-gold hover:text-saffron transition-colors text-xs font-semibold"
            >
              View All Seva Activities
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-14 bg-navy">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            eyebrow="Upcoming Events"
            hindiTitle="आगामी कार्यक्रम"
            englishTitle="What's Coming Up"
          />
          <div
            ref={eventsRef}
            className="reveal-stagger flex flex-wrap justify-center items-stretch gap-3.5 max-w-3xl mx-auto"
          >
            {upcomingEvents.map((event) => (
              <div key={event._id || event.id || event.slug} className="w-[235px] flex">
                <EventCard event={event} />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/events"
              className="inline-flex items-center gap-1 text-gold hover:text-saffron transition-colors text-xs font-semibold"
            >
              View All Events
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="relative py-14 bg-navy-2 overflow-hidden">
        <RamBackground rows={3} cols={2} />
        <div ref={donateRef} className="reveal relative max-w-md mx-auto px-6 text-center">
          <p className="font-hindi text-lg text-saffron mb-1 font-bold">सेवा में सहयोग करें</p>
          <h2 className="font-display text-2xl text-cream mb-3">
            Support Our Seva
          </h2>
          <p className="text-cream/70 mb-5 text-xs leading-relaxed">
            आपका छोटा सा योगदान भी किसी के जीवन में बड़ा बदलाव ला सकता है। आइए मिलकर सेवा की इस
            यात्रा को आगे बढ़ाएं।
          </p>
          <Link
            to="/donate"
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-semibold transition-all shadow-md cursor-pointer text-xs"
          >
            <HeartHandshake size={15} />
            Donate Securely
          </Link>
        </div>
      </section>

      {/* Members preview */}
      <section className="py-14 bg-navy">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            eyebrow="Our Team"
            hindiTitle="हमारे सदस्य"
            englishTitle="People Behind the Seva"
          />
          <div
            ref={membersRef}
            className="reveal-stagger flex flex-wrap justify-center items-start gap-4 max-w-2xl mx-auto"
          >
            {members.slice(0, 5).map((member) => (
              <div key={member._id || member.id} className="w-[180px]">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/members"
              className="inline-flex items-center gap-1 text-gold hover:text-saffron transition-colors text-xs font-semibold"
            >
              Meet the Full Team
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery preview - Updated with Link to /gallery */}
      <section className="py-14 bg-navy-2">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeading
            eyebrow="Moments of Seva"
            hindiTitle="हमारी झलकियां"
            englishTitle="Gallery"
          />
          <div ref={galleryRef} className="reveal-stagger grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {previewGallery.map((item) => (
              <Link
                key={item._id || item.id}
                to="/gallery"
                className="aspect-square rounded-xl overflow-hidden bg-navy border border-gold/15 shadow-sm block group cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title || item.caption || 'Gallery Image'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1 text-gold hover:text-saffron transition-colors text-xs font-semibold"
            >
              View Full Gallery
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Updates Section (With View All Updates Link) */}
      <section className="py-14 bg-navy">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            eyebrow="Stay Informed"
            hindiTitle="ताजा समाचार"
            englishTitle="Latest Updates"
          />
          <div
            ref={updatesRef}
            className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5"
          >
            {featuredUpdates.map((update) => {
              const rawDesc = update.description || update.content || update.excerpt;
              const author = update.adminName || (update.createdBy ? update.createdBy.split('@')[0] : 'Admin');
              return (
                <Link
                  key={update._id || update.id || update.slug}
                  to={`/updates/${update.slug || update._id || update.id}`}
                  className="premium-card rounded-2xl overflow-hidden hover:border-gold/50 hover:-translate-y-1 transition-all duration-300 bg-navy-2 border border-gold/15 p-4 flex flex-col justify-between shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[9px] uppercase tracking-wider text-saffron font-bold bg-saffron/15 px-2 py-0.5 rounded-full border border-gold/20">
                        {update.category || 'NOTICE'}
                      </span>
                      {update.date && (
                        <span className="text-[10px] text-cream/45 font-mono">
                          {update.date}
                        </span>
                      )}
                    </div>
                    <h3 className="font-hindi text-base text-cream font-bold group-hover:text-saffron transition-colors line-clamp-1 mb-1.5">
                      {update.title}
                    </h3>
                    {rawDesc && (
                      <p className="text-xs text-cream/65 italic line-clamp-2 leading-relaxed font-hindi">
                        {formatQuote(rawDesc)}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-2.5 border-t border-gold/10 flex items-center justify-between text-[10px] text-cream/50">
                    <span>By: <b className="text-gold/80">{author}</b></span>
                    <span className="text-gold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View Details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Updates Button */}
          <div className="text-center mt-8">
            <Link
              to="/updates"
              className="inline-flex items-center gap-1.5 text-gold hover:text-saffron transition-colors text-xs font-semibold px-4 py-2 rounded-full border border-gold/20 bg-navy-2 hover:border-gold/50"
            >
              View All Updates
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Daily quote section updated with dynamic IST thought */}
      <section className="py-12 bg-navy-2 text-center border-y border-gold/10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-saffron mb-1.5 font-semibold">आज का विचार</p>
        <blockquote className="font-hindi text-base md:text-lg text-cream max-w-lg mx-auto px-6 leading-relaxed">
          {todaysThought.hindi}
        </blockquote>
        <p className="text-[11px] text-cream/50 mt-1.5">{todaysThought.english || todaysThought.meaning}</p>
      </section>

      {/* Volunteer CTA */}
      <section className="py-14 bg-navy">
        <div ref={volunteerRef} className="reveal max-w-md mx-auto px-6 text-center">
          <p className="font-hindi text-lg text-saffron mb-1 font-bold">स्वयंसेवक बनें</p>
          <h2 className="font-display text-2xl text-cream mb-2">
            Become a Volunteer
          </h2>
          <p className="text-cream/70 mb-5 text-xs leading-relaxed">
            अपना समय और कौशल समाज सेवा में लगाएं। हर हाथ की जरूरत है।
          </p>
          <Link
            to="/volunteer"
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-gold/40 text-cream hover:border-gold hover:text-gold transition-all cursor-pointer text-xs font-medium shadow-sm"
          >
            Join as Volunteer
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <WhatsappBand />
    </>
  );
}