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

export default function SevaCard({ 
  title, 
  titleEnglish, 
  subtitle, 
  description, 
  category, 
  icon, 
  image,
  adminName,
  createdBy 
}) {
  const Icon = ICONS[icon] || Heart;
  const subText = titleEnglish || subtitle;
  const creatorName = adminName || (createdBy ? createdBy.split('@')[0] : 'Admin');

  return (
    <article className="premium-card rounded-2xl p-5 h-full flex flex-col justify-between hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 overflow-hidden bg-navy-2 border border-gold/15 shadow-xl max-w-sm mx-auto w-full">
      <div>
        {/* Cloudinary Image Banner - Compact Height */}
        {image && (
          <div className="-mx-5 -mt-5 mb-4 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              loading="lazy"
              className="w-full h-32 object-cover border-b border-gold/20 hover:scale-105 transition-transform duration-700" 
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
        
        {/* Scrollable Description Container with hidden scrollbars */}
        <div className="max-h-24 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <p className="text-xs text-cream/70 leading-relaxed whitespace-pre-line">{description}</p>
        </div>
      </div>

      {/* Admin Attribution Footer with No-Wrap */}
      <div className="mt-4 pt-3 border-t border-gold/10 flex items-center justify-between text-[11px] text-cream/70 whitespace-nowrap bg-navy/30 -mx-5 -mb-5 px-5 py-2.5">
        <span className="truncate">श्री राम सेवा समिति</span>
        <span className="flex items-center gap-1 text-gold font-medium bg-saffron/10 px-2 py-0.5 rounded-md border border-gold/20 truncate ml-2">
          <UserCheck size={11} className="text-saffron shrink-0" /> By Admin: {creatorName}
        </span>
      </div>
    </article>
  );
}