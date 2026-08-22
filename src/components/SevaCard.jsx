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
    <article className="premium-card rounded-2xl p-7 h-full flex flex-col justify-between hover:border-gold/40 hover:-translate-y-1 transition-all duration-500 overflow-hidden bg-navy-2 border border-gold/15 shadow-xl">
      <div>
        {/* Cloudinary Image Banner */}
        {image && (
          <div className="-mx-7 -mt-7 mb-5 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              loading="lazy"
              className="w-full h-44 object-cover border-b border-gold/20 hover:scale-105 transition-transform duration-700" 
            />
          </div>
        )}

        {/* Fallback Icon */}
        {!image && (
          <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron mb-5 border border-gold/20">
            <Icon size={22} aria-hidden="true" />
          </div>
        )}

        <span className="text-xs uppercase tracking-[0.15em] text-gold/80 mb-2 block">
          {category || 'Seva'}
        </span>
        <h3 className="font-hindi text-2xl text-cream mb-1">{title}</h3>
        {subText && <p className="text-sm text-cream/50 mb-3">{subText}</p>}
        <p className="text-sm text-cream/70 leading-relaxed line-clamp-4">{description}</p>
      </div>

      {/* Admin Attribution Footer */}
      <div className="mt-5 pt-3.5 border-t border-gold/10 flex items-center justify-between text-xs text-cream/60">
        <span>श्री राम सेवा समिति</span>
        <span className="flex items-center gap-1 text-gold font-medium bg-saffron/10 px-2 py-0.5 rounded-md border border-gold/20">
          <UserCheck size={12} className="text-saffron shrink-0" /> By Admin: {creatorName}
        </span>
      </div>
    </article>
  );
}