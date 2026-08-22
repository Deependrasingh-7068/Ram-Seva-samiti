import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import { Calendar, UserCheck, ArrowRight, BellRing } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

function formatDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const trimmed = desc.trim().replace(/^["“']+|["”']+$/g, '');
  return `“${trimmed}”`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function Updates() {
  const { updates = [] } = useAdmin();
  const ref = useScrollReveal();

  const safeUpdates = Array.isArray(updates)
    ? updates.filter((u) => u && typeof u === 'object')
    : [];

  return (
    <div className="pt-28 pb-20 bg-navy min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center max-w-xl mx-auto mb-10">
          <p className="font-hindi text-lg text-saffron mb-1">ताजा समाचार एवं सूचनाएं</p>
          <h1 className="font-display text-3xl md:text-4xl text-cream">Notices & Updates</h1>
          <p className="text-xs text-cream/60 mt-2">समिति द्वारा जारी की गई सभी नवीनतम सूचनाएं और महत्वपूर्ण घोषणाएं।</p>
        </header>

        {safeUpdates.length === 0 ? (
          <div className="text-center py-16 bg-navy-2 rounded-2xl border border-gold/15 max-w-md mx-auto">
            <BellRing size={28} className="text-saffron mx-auto mb-2 opacity-50" />
            <p className="text-cream/50 text-sm">फिलहाल कोई नई सूचना उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div 
            ref={ref} 
            className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {safeUpdates.map((item, index) => {
              const updateKey = item._id || item.id || `update-${index}`;
              const targetSlug = item.slug || item._id || item.id;
              const rawDesc = item.description || item.content || item.excerpt || '';
              const author = item.adminName || (item.createdBy ? item.createdBy.split('@')[0] : 'Admin');

              return (
                <div
                  key={updateKey}
                  className="bg-navy-2 border border-gold/15 rounded-2xl p-5 flex flex-col justify-between shadow-xl hover:border-gold/45 hover:-translate-y-1 transition-all duration-300 min-h-[220px] group"
                >
                  <div>
                    {/* Top Row: Category Badge & Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron uppercase tracking-widest border border-gold/20">
                        {item.category || 'NOTICE'}
                      </span>
                      {item.date && (
                        <div className="flex items-center gap-1 text-[11px] text-cream/50 font-mono">
                          <Calendar size={12} className="text-saffron" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-hindi font-bold text-cream group-hover:text-saffron transition-colors leading-snug mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {rawDesc && (
                      <p className="text-xs text-cream/70 font-hindi italic leading-relaxed line-clamp-3">
                        {formatDescription(rawDesc)}
                      </p>
                    )}
                  </div>

                  {/* Bottom Footer: Author Attribution & Link */}
                  <div className="pt-3 mt-4 border-t border-gold/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-gold font-medium bg-saffron/10 px-2 py-0.5 rounded border border-gold/20 text-[10px]">
                      <UserCheck size={11} className="text-saffron shrink-0" />
                      By Admin: {author}
                    </span>

                    <Link
                      to={`/updates/${targetSlug}`}
                      className="inline-flex items-center gap-1 text-[11px] text-gold hover:text-saffron font-medium transition-colors"
                    >
                      View Details
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}