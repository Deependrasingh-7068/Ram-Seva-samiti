import { useState } from 'react';
import EventCard from '../components/EventCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { useAdmin } from '../context/AdminContext';

export default function Events() {
  const ref = useScrollReveal();
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = (events || []).filter((event) => {
    if (!event || !event.date) return false;

    const eventDate = parseLocalDate(event.date);
    if (!eventDate || isNaN(eventDate.getTime())) return false;
    eventDate.setHours(0, 0, 0, 0);

    // Calculate exact difference in whole calendar days
    const diffTime = today.getTime() - eventDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (tab === 'upcoming') {
      return diffDays <= 0;
    }

    if (tab === 'past') {
      return diffDays > 0 && diffDays <= 10;
    }

    return false;
  });

  return (
    <div className="pt-28 pb-20 bg-navy min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center max-w-xl mx-auto mb-10">
          <p className="font-hindi text-xl text-saffron mb-1">आगामी कार्यक्रम</p>
          <h1 className="font-display text-3xl md:text-4xl text-cream">Events</h1>
        </header>

        <div className="flex justify-center gap-2 mb-10" role="tablist">
          {['upcoming', 'past'].map((t) => (
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
              {t === 'past' ? 'Past (Last 10 Days)' : t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-cream/50 py-12 text-sm">
            {tab === 'upcoming'
              ? 'फिलहाल कोई आगामी कार्यक्रम उपलब्ध नहीं है।'
              : 'पिछले 10 दिनों में कोई कार्यक्रम समाप्त नहीं हुआ है।'}
          </p>
        ) : (
          <div
            ref={ref}
            className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center"
          >
            {filtered.map((event) => {
              const eventKey = event._id || event.id || event.slug || Math.random();
              return <EventCard key={eventKey} event={event} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}