import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryCategories } from '../data/gallery';

export default function GalleryGrid({ items }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const showNext = () =>
    setLightboxIndex((i) => (i + 1) % filtered.length);
  const showPrev = () =>
    setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Gallery categories">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-saffron text-navy font-medium'
                : 'text-cream/70 border border-gold/20 hover:border-gold/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid - Columns aur badha diye gaye hain taaki images aur bhi choti aur neat dikhein */}
      <div className="columns-4 sm:columns-5 md:columns-6 lg:columns-7 gap-2.5 [column-fill:_balance]">
        {filtered.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openLightbox(idx)}
            className="mb-2.5 w-full block relative group rounded-lg overflow-hidden break-inside-avoid focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold cursor-pointer bg-navy-2 border border-gold/15 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.caption}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-500 flex items-end p-2 opacity-0 group-hover:opacity-100">
              <span className="text-cream text-[11px] font-hindi line-clamp-1">{item.caption}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-md flex items-center justify-center px-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close preview"
            className="absolute top-6 right-6 text-cream hover:text-saffron transition-colors cursor-pointer"
          >
            <X size={28} />
          </button>
          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous image"
            className="absolute left-3 md:left-8 text-cream hover:text-saffron transition-colors cursor-pointer"
          >
            <ChevronLeft size={32} />
          </button>
          <figure className="max-w-3xl w-full">
            <img
              src={filtered[lightboxIndex].image}
              alt={filtered[lightboxIndex].caption}
              className="w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-gold/20"
            />
            <figcaption className="text-center text-cream/80 font-hindi mt-4 text-sm md:text-base">
              {filtered[lightboxIndex].caption}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next image"
            className="absolute right-3 md:right-8 text-cream hover:text-saffron transition-colors cursor-pointer"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}