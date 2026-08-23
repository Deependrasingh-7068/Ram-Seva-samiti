import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { X, Calendar, Image as ImageIcon, UserCheck } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

const CATEGORIES = ['ALL', 'FESTIVAL', 'SEVA', 'TEMPLE', 'COMMUNITY'];

function formatDate(iso) {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Gallery() {
  const { gallery = [] } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeImage, setActiveImage] = useState(null);
  const ref = useScrollReveal();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    if (activeImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeImage]);

  // Valid items only
  const filtered = (gallery || []).filter((item) => {
    if (!item) return false;
    if (selectedCategory === 'ALL') return true;
    return item.category?.toUpperCase() === selectedCategory.toUpperCase();
  });

  return (
    <div className="pt-32 pb-24 bg-navy min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-hindi text-2xl text-saffron mb-2">चित्र दीर्घा</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream">Gallery</h1>
        </header>

        {/* Category Filter Pills */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-saffron text-navy font-semibold shadow-md'
                  : 'text-cream/70 border border-gold/20 hover:border-gold/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid - Images choti aur compact dikhane ke liye grid columns badhaye gaye hain */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-navy-2/40 rounded-3xl border border-gold/10 max-w-md mx-auto">
            <ImageIcon className="mx-auto text-gold/30 mb-3" size={40} />
            <p className="text-cream/60 text-sm">इस श्रेणी में कोई चित्र उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div ref={ref} className="reveal-stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((item) => {
              const itemKey = item._id || item.id || Math.random();
              const hasValidImage = item.image && item.image.trim().length > 0;
              const creatorName = item.adminName || (item.createdBy ? item.createdBy.split('@')[0] : 'Admin');

              return (
                <div
                  key={itemKey}
                  onClick={() => hasValidImage && setActiveImage(item)}
                  className="premium-card group rounded-xl overflow-hidden cursor-pointer hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 bg-navy-2 border border-gold/15 flex flex-col justify-between shadow-lg"
                >
                  <div className="relative aspect-square bg-navy-2 overflow-hidden flex items-center justify-center">
                    {hasValidImage ? (
                      <img
                        src={item.image}
                        alt={item.title || 'Gallery Item'}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.classList.add('bg-navy-2');
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-cream/40">
                        <ImageIcon size={24} className="text-gold/40" />
                        <span className="text-[10px]">No image</span>
                      </div>
                    )}

                    {/* Category Top Tag */}
                    <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full bg-navy/80 backdrop-blur-md text-saffron uppercase font-bold border border-gold/20">
                      {item.category || 'General'}
                    </span>
                  </div>

                  {/* Compact Details Panel */}
                  <div className="p-2.5 bg-navy-2 border-t border-gold/10 space-y-1">
                    <h3 className="text-xs text-cream font-semibold truncate">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-[10px] text-cream/65 pt-1 border-t border-gold/10">
                      {item.date ? (
                        <span className="truncate">{formatDate(item.date)}</span>
                      ) : <span></span>}

                      <span className="text-gold font-medium bg-saffron/10 px-1.5 py-0.5 rounded border border-gold/20 truncate">
                        {creatorName}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Image Modal Lightbox */}
        {activeImage && (
          <div 
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setActiveImage(null)}
          >
            <div 
              className="max-w-3xl w-full bg-navy-2 border border-gold/30 rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-navy/80 text-cream/70 hover:text-saffron flex items-center justify-center border border-gold/20 cursor-pointer shadow-md transition-all"
              >
                <X size={18} />
              </button>
              
              <div className="max-h-[65vh] bg-navy flex items-center justify-center overflow-hidden border-b border-gold/15">
                <img 
                  src={activeImage.image} 
                  alt={activeImage.title} 
                  className="w-full h-full object-contain max-h-[65vh]" 
                />
              </div>

              <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-navy-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-saffron font-medium">{activeImage.category}</span>
                  <h3 className="font-display text-lg text-cream mt-0.5">{activeImage.title}</h3>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {activeImage.date && (
                    <span className="text-xs text-cream/60 flex items-center gap-1.5">
                      <Calendar size={13} className="text-saffron" /> {formatDate(activeImage.date)}
                    </span>
                  )}
                  <span className="text-xs text-gold font-medium flex items-center gap-1 bg-saffron/10 px-2.5 py-1 rounded-md border border-gold/20">
                    <UserCheck size={12} className="text-saffron" /> By Admin: {activeImage.adminName || (activeImage.createdBy ? activeImage.createdBy.split('@')[0] : 'Admin')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}