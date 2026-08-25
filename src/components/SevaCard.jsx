import { useState } from 'react';
import OBBadge from './OBBadge';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Utensils,
  Droplet,
  Sprout,
  BookOpen,
  HandHeart,
  Heart,
  Sparkles,
  UserCheck,
  X,
  Maximize2,
  ArrowRight
} from 'lucide-react';

const ICONS = {
  flame: Flame,
  utensils: Utensils,
  droplet: Droplet,
  sprout: Sprout,
  'book-open': BookOpen,
  'hand-heart': HandHeart,
  heart: Heart,
  sparkles: Sparkles,
};

export default function SevaCard({ title, titleEnglish, subtitle, description, category, icon, image, adminName, createdBy, postedByRole, authorName, bearerDesignation, enableModal = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const Icon = ICONS[icon] || Heart;
  const subText = titleEnglish || subtitle;
  const creatorName = adminName || (createdBy ? createdBy.split('@')[0] : 'Admin');

  const handleClick = () => {
    if (enableModal) {
      setIsModalOpen(true);
    } else {
      navigate('/seva');
    }
  };

  return (
    <>
      {/* Main Card */}
      <article 
        onClick={handleClick}
        className={`premium-card rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-500 overflow-hidden shadow-xl w-full cursor-pointer relative group ${
  postedByRole === 'OFFICE_BEARER'
    ? 'bg-gradient-to-b from-navy-2 to-navy border-2 border-gold shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:border-saffron hover:-translate-y-1'
    : 'bg-navy-2 border border-gold/15 hover:border-gold/40 hover:-translate-y-1'
}`}
      >
        <div>
          {/* Hover Indicator Icon */}
          <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-navy/80 backdrop-blur-md text-saffron flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gold/30 shadow-lg">
            {enableModal ? <Maximize2 size={14} /> : <ArrowRight size={14} />}
          </div>

          {/* Cloudinary Image Banner */}
          {image && (
            <div className="-mx-6 -mt-6 mb-4 overflow-hidden">
              <img 
                src={image} 
                alt={title} 
                loading="lazy"
                className="w-full h-44 object-cover border-b border-gold/20 group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          )}

          {/* Fallback Icon */}
          {!image && (
            <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron mb-4 border border-gold/20">
              <Icon size={18} aria-hidden="true" />
            </div>
          )}

          <span className="text-[10px] uppercase tracking-[0.15em] text-gold/80 mb-1.5 block">
            {category || 'Seva'}
          </span>
          <h3 className="font-hindi text-xl text-cream mb-1">{title}</h3>
          {subText && <p className="text-xs text-cream/50 mb-2.5">{subText}</p>}
          
          {/* Scrollable Description Container */}
          <div className="max-h-28 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <p className="text-xs text-cream/70 leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        </div>

                {/* Admin Attribution Footer */}
        <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-[11px] text-cream/70 whitespace-nowrap bg-navy/30 -mx-6 -mb-6 px-6 py-2.5">
          <span className="truncate">श्री राम सेवा समिति</span>
          <OBBadge postedByRole={postedByRole} adminName={adminName} createdBy={createdBy} authorName={authorName} bearerDesignation={bearerDesignation} />
        </div>
      </article>

      {/* ZOOMED COMPACT MODAL VIEW (Shifted down from navbar) */}
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
              {image && (
                <div className="w-full overflow-hidden border-b border-gold/20">
                  <img src={image} alt={title} className="w-full h-52 sm:h-60 object-cover" />
                </div>
              )}
              <div className="px-5 pt-5 pb-3 bg-navy-2 border-b border-gold/10">
                <span className="text-[10px] uppercase tracking-[0.15em] text-gold/80 block mb-1">
                  {category || 'Seva'}
                </span>
                <h2 className="font-hindi text-xl sm:text-2xl text-cream font-bold">
                  {title}
                </h2>
                {subText && <p className="text-xs text-gold/90 font-medium mt-0.5">{subText}</p>}
              </div>
            </div>

            {/* SCROLLABLE CONTENT SECTION */}
            <div className="overflow-y-auto px-5 py-3.5 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <p className="text-xs sm:text-sm text-cream/85 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* FIXED FOOTER SECTION */}
            
            <div className="shrink-0 pt-3 pb-3 px-5 border-t border-gold/20 flex items-center justify-between text-[11px] text-cream/70 whitespace-nowrap bg-navy/40">
              <span className="truncate">श्री राम सेवा समिति</span>
              <OBBadge postedByRole={postedByRole} adminName={adminName} createdBy={createdBy} authorName={authorName} bearerDesignation={bearerDesignation} />
            </div>

          </div>
        </div>
      )}
    </>
  );
}