import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, UserCheck } from 'lucide-react';

function formatDate(iso) {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return iso;
  
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function EventCard({ event }) {
  if (!event) return null;

  // Normalize today's date to midnight for accurate day comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = event.date ? new Date(event.date) : null;
  if (eventDate) eventDate.setHours(0, 0, 0, 0);

  // Mark as Past if the date is earlier than today or explicitly marked past
  const isPast = (event.status || '').toLowerCase() === 'past' || (eventDate && eventDate < today);
  
  const eventImage = event.image || (event.slug ? `/assets/events/${event.slug}.jpg` : '');
  const creatorName = event.adminName || (event.createdBy ? event.createdBy.split('@')[0] : 'Admin');

  return (
    <Link
      to={`/events/${event.slug || event._id || event.id}`}
      className="premium-card group block w-full rounded-2xl overflow-hidden hover:border-gold/45 hover:-translate-y-1 transition-all duration-300 bg-navy-2 border border-gold/15 flex flex-col justify-between shadow-md"
    >
      <div>
        {/* Compact Banner Area */}
        <div className="relative aspect-[16/10] bg-navy overflow-hidden">
          {eventImage ? (
            <img
              src={eventImage}
              alt={event.title || 'Event'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-navy flex items-center justify-center text-[10px] text-cream/40 font-mono">
              No Image
            </div>
          )}

          {/* Dynamic Badge */}
          <span
            className={`absolute top-2.5 left-2.5 text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase shadow-md transition-colors ${
              isPast 
                ? 'bg-slate-800/90 text-slate-300 border border-gold/20' 
                : 'bg-saffron text-navy font-semibold'
            }`}
          >
            {isPast ? 'Past Event' : 'Upcoming'}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-4 pb-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold/80 block truncate">
            {event.category || 'EVENT'}
          </span>
          <h3 className="font-hindi text-base font-bold text-cream mt-1 mb-2 leading-snug line-clamp-1">
            {event.title}
          </h3>
          
          <div className="space-y-1 text-xs text-cream/65 pt-1 border-t border-gold/10">
            {event.date && (
              <p className="flex items-center gap-1.5 text-[11px]">
                <Calendar size={12} className="text-saffron shrink-0" />
                <span>{formatDate(event.date)}</span>
              </p>
            )}
            {event.time && (
              <p className="flex items-center gap-1.5 text-[11px]">
                <Clock size={12} className="text-saffron shrink-0" />
                <span>{event.time}</span>
              </p>
            )}
            {event.location && (
              <p className="flex items-center gap-1.5 text-[11px] truncate">
                <MapPin size={12} className="text-saffron shrink-0" />
                <span className="truncate">{event.location}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Attribution Footer */}
      <div className="px-4 py-2 bg-navy/50 border-t border-gold/10 flex items-center justify-between text-[10px] text-cream/50">
        <span>श्री राम सेवा</span>
        <span className="flex items-center gap-1 text-gold font-medium bg-saffron/10 px-1.5 py-0.5 rounded border border-gold/20 text-[9px]">
          <UserCheck size={10} className="text-saffron shrink-0" /> {creatorName}
        </span>
      </div>
    </Link>
  );
}