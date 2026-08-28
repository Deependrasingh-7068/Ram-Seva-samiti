import { useState } from 'react';
import EventCard from '../components/EventCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { useAdmin } from '../context/AdminContext';
import { getEventStatus } from '../utils/eventStatus';

export default function Events() {
  const ref = useScrollReveal();
  // Agar aap chahte hain ki by default Past events dikhein (kyunki abhi wahi hain), 
  // toh aap 'upcoming' ki jagah 'past' likh sakte hain. Filhal main 'upcoming' hi rakh raha hoon.
  const [tab, setTab] = useState('upcoming');
  const { events = [] } = useAdmin();

  // Helper to parse dates safely into local midnight
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const datePart = String(dateStr).split('T')[0];
    const parts = datePart.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const [year, month, day] = parts;
      return new Date(year, month - 1, day);
    }
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const filtered = (events || []).filter((event) => {
    if (!event || !event.date) return false;
    
    // FIX 1: Status ko safely lowercase mein convert kiya gaya hai
    // Taaki 'PAST', 'Past' aur 'past' aapas mein match ho sakein
    const status = getEventStatus(event)?.toLowerCase();
    if (status !== tab) return false;

    // Past tab: sirf pichhle 5 din ke andar khatam hue events dikhao
    if (tab === 'past') {
      const eventDate = parseLocalDate(event.date);
      if (!eventDate) return false;
      const now = new Date();
      
      // FIX 2: Math.abs() add kiya taaki negative values ki wajah se issue na ho
      const diffDays = Math.abs(now - eventDate) / (1000 * 60 * 60 * 24);
      
      // Note: Agar aapke Past Events 5 din se zyada purane hain, toh wo yahan hide ho jayenge.
      // Agar aap sabhi past events dikhana chahte hain, toh neeche wali line ko comment kar dena.
      if (diffDays > 5) return false;
    }

    return true;
  });

  return (
    <div className="pt-28 pb-20 bg-navy min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center max-w-xl mx-auto mb-10">
          <p className="font-hindi text-xl text-saffron mb-1">आगामी कार्यक्रम</p>
          <h1 className="font-display text-3xl md:text-4xl text-cream">Events</h1>
        </header>

        <div className="flex justify-center gap-2 mb-10" role="tablist">
          {['upcoming', 'ongoing', 'past'].map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs capitalize transition-all cursor-pointer ${
                tab === t
                  ? 'bg-saffron text-navy font-semibold shadow-md'
                  : 'text-cream/70 border border-gold/20 hover:border-gold/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-cream/50 py-12 text-sm">
            {tab === 'upcoming'
              ? 'फिलहाल कोई आगामी कार्यक्रम उपलब्ध नहीं है।'
              : 'पिछले 5 दिनों में कोई कार्यक्रम समाप्त नहीं हुआ है।'}
          </p>
        ) : (
          <div
            ref={ref}
            className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center"
          >
            {filtered.map((event) => {
              const eventKey = event._id || event.id || event.slug || Math.random();
              // enableModal={true} pass kiya hai taaki Events page par click karne par zoom modal khule
              return <EventCard key={eventKey} event={event} enableModal={true} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}