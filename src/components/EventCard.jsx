import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OBBadge from './OBBadge';
import { Calendar, Clock, MapPin, UserCheck, X, Maximize2, ArrowRight } from 'lucide-react';

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

export default function EventCard({ event, enableModal = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (enableModal) {
      setIsModalOpen(true);
    } else {
      navigate('/events');
    }
  };

  return (
    <>
            <article
        onClick={handleClick}
        className={`premium-card group block w-full rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md cursor-pointer relative ${
          event.postedByRole === 'OFFICE_BEARER'
            ? 'bg-gradient-to-b from-navy-2 to-navy border-2 border-gold shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:border-saffron hover:-translate-y-1'
            : 'bg-navy-2 border border-gold/15 hover:border-gold/45 hover:-translate-y-1'
        }`}
      >
        <div>
          {/* Hover Indicator Icon */}
          <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-navy/80 backdrop-blur-md text-saffron flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gold/30 shadow-lg">
            {enableModal ? <Maximize2 size={14} /> : <ArrowRight size={14} />}
          </div>

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
          <OBBadge postedByRole={event.postedByRole} adminName={event.adminName} createdBy={event.createdBy} authorName={event.authorName} bearerDesignation={event.bearerDesignation} />
        </div>
      </article>

      {/* ZOOMED COMPACT MODAL VIEW FOR EVENTS */}
      {enableModal && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 pb-10 bg-navy/85 backdrop-blur-md px-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-navy-2 border border-gold/30 rounded-3xl max-w-md w-full relative shadow-2xl flex flex-col max-h-[85vh] overflow-hidden my-auto">
            
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-navy border border-gold/20 text-cream/70 hover:text-saffron hover:border-saffron flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <X size={18} />
            </button>

            {/* FIXED HEADER SECTION */}
            <div className="shrink-0">
              {eventImage && (
                <div className="w-full overflow-hidden border-b border-gold/20">
                  <img src={eventImage} alt={event.title} className="w-full h-52 sm:h-60 object-cover" />
                </div>
              )}
              <div className="px-5 pt-5 pb-3 bg-navy-2 border-b border-gold/10">
                <span className="text-[10px] uppercase tracking-[0.15em] text-gold/80 block mb-1">
                  {event.category || 'EVENT'}
                </span>
                <h2 className="font-hindi text-xl sm:text-2xl text-cream font-bold">
                  {event.title}
                </h2>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-cream/70">
                  {event.date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-saffron" /> {formatDate(event.date)}
                    </span>
                  )}
                  {event.time && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-saffron" /> {event.time}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SCROLLABLE CONTENT SECTION */}
            <div className="overflow-y-auto px-5 py-3.5 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3">
              {event.location && (
                <p className="flex items-center gap-1.5 text-xs text-gold/90 bg-saffron/10 px-3 py-2 rounded-xl border border-gold/20">
                  <MapPin size={14} className="text-saffron shrink-0" />
                  <span>{event.location}</span>
                </p>
              )}
              {event.description && (
                <p className="text-xs sm:text-sm text-cream/85 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              )}
            </div>

                       {/* FIXED FOOTER SECTION */}
            <div className="shrink-0 pt-3 pb-3 px-5 border-t border-gold/20 flex items-center justify-between text-[11px] text-cream/70 whitespace-nowrap bg-navy/40">
              <span className="truncate">श्री राम सेवा समिति</span>
              <OBBadge postedByRole={event.postedByRole} adminName={event.adminName} createdBy={event.createdBy} authorName={event.authorName} bearerDesignation={event.bearerDesignation} />
            </div>

          </div>
        </div>
      )}
    </>
  );
}