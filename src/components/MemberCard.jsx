import React from 'react';

function getInitialLetter(nameHindi, nameEnglish) {
  if (nameEnglish && nameEnglish.trim().length > 0) {
    return nameEnglish.trim().charAt(0).toUpperCase();
  }
  if (nameHindi && nameHindi.trim().length > 0) {
    return nameHindi.trim().charAt(0);
  }
  return 'R';
}

function cleanBio(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const trimmed = desc.trim().replace(/^["“']+|["”']+$/g, '');
  return `“${trimmed}”`;
}

export default function MemberCard({ member }) {
  if (!member) return null;

  // Dynamic Multi-Key Extraction
  const displayNameHindi = member.nameHindi || member.name || '';
  const displayNameEnglish = member.nameEnglish || '';
  const displayRoleHindi = member.roleHindi || member.designationHindi || '';
  const displayRoleEnglish = member.roleEnglish || member.role || member.designation || 'Member';
  const displayPhoto = member.image || member.photo || '';
  const displayBio = member.bio || member.description || '';
  const initial = getInitialLetter(displayNameHindi, displayNameEnglish);

  return (
    <article className="text-center group flex flex-col items-center max-w-[240px]">
      
      {/* Profile Photo / Avatar */}
      <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold/70 group-hover:scale-105 transition-all duration-500 shadow-xl bg-navy flex items-center justify-center shrink-0">
        {displayPhoto && displayPhoto.trim().length > 0 ? (
          <img
            src={displayPhoto}
            alt={displayNameEnglish || displayNameHindi || 'Member'}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-saffron/15 text-saffron font-display text-2xl font-bold flex items-center justify-center uppercase">
            {initial}
          </div>
        )}
      </div>

      {/* Name (English / Hindi Position Swapped) */}
      <h3 className="font-sans text-lg sm:text-xl font-bold text-cream mt-3 leading-snug">
        {displayNameEnglish || displayNameHindi}
      </h3>
      {displayNameEnglish && displayNameHindi && (
        <p className="font-hindi text-[12px] text-gold/75 font-medium tracking-wide">
          {displayNameHindi}
        </p>
      )}

      {/* Role / Designation */}
      <p className="text-xs text-saffron font-semibold mt-1 uppercase tracking-wider">
        {displayRoleEnglish}
      </p>
      {displayRoleHindi && (
        <p className="font-hindi text-[11px] text-cream/60">
          {displayRoleHindi}
        </p>
      )}

      {/* Bio with Hidden Scrollbar & Text Wrap */}
      {displayBio && (
        <div className="relative w-full h-16 mt-2">
          <div className="h-full overflow-y-auto px-1 text-xs text-cream/70 font-hindi leading-relaxed italic [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <p className="break-words">
              {cleanBio(displayBio)}
            </p>
          </div>
          {/* Bottom subtle gradient fade */}
          <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-navy to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
        </div>
      )}
    </article>
  );
}