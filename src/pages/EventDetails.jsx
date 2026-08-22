import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import events from '../data/events';
import NotFound from './NotFound';
// 1. Import useAuth
import { useAuth } from '../context/AuthContext';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function EventDetails() {
  const { slug } = useParams();
  const event = events.find((e) => e.slug === slug);
  
  // 2. Extract user and setAuthOpen from context
  const { user, setAuthOpen } = useAuth();

  if (!event) return <NotFound />;

  return (
    <div className="pt-32 pb-24 bg-navy">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-saffron transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back to Events
        </Link>

        <div className="aspect-video rounded-2xl overflow-hidden bg-navy-2 mb-8">
          <img
            src={`/assets/events/${event.slug}.jpg`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <span className="text-xs uppercase tracking-[0.15em] text-gold/80">
          {event.category}
        </span>
        <h1 className="font-hindi text-3xl md:text-4xl text-cream mt-2 mb-6">{event.title}</h1>

        <div className="flex flex-wrap gap-6 text-sm text-cream/70 mb-8 pb-8 border-b border-gold/10">
          <span className="flex items-center gap-2">
            <Calendar size={16} className="text-saffron" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} className="text-saffron" />
            {event.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-saffron" />
            {event.location}
          </span>
        </div>

        <p className="font-hindi text-lg text-cream/80 leading-relaxed mb-10">
          {event.description}
        </p>

        {event.registrationRequired && event.status === 'upcoming' && (
          <a
            href="#register"
            // 3. Intercept the Register button click
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setAuthOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-saffron hover:bg-saffron-deep text-navy font-medium transition-colors"
          >
            Register Now
          </a>
        )}
      </div>
    </div>
  );
}