import React from 'react';
import { useAdmin } from '../context/AdminContext';
import useScrollReveal from '../hooks/useScrollReveal';
import { Phone, Mail, UserCheck } from 'lucide-react';

function getInitialLetter(nameHindi, nameEnglish) {
  if (typeof nameEnglish === 'string' && nameEnglish.trim().length > 0) {
    return nameEnglish.trim().charAt(0).toUpperCase();
  }
  if (typeof nameHindi === 'string' && nameHindi.trim().length > 0) {
    return nameHindi.trim().charAt(0);
  }
  return 'R';
}

function formatBio(bio) {
  if (!bio || typeof bio !== 'string') return '';
  const trimmed = bio.trim().replace(/^["“']+|["”']+$/g, '');
  return `“${trimmed}”`;
}

function getSafeCreatorName(m) {
  if (!m) return 'Admin';
  if (typeof m.adminName === 'string' && m.adminName.trim().length > 0) {
    return m.adminName.trim();
  }
  if (typeof m.createdBy === 'string' && m.createdBy.includes('@')) {
    return m.createdBy.split('@')[0];
  }
  if (typeof m.createdBy === 'string' && m.createdBy.trim().length > 0) {
    return m.createdBy.trim();
  }
  return 'Admin';
}

export default function Members() {
  const { members = [] } = useAdmin();
  const ref = useScrollReveal();

  const safeMembersList = Array.isArray(members)
    ? members.filter((m) => m && typeof m === 'object')
    : [];

  return (
    <div className="pt-28 pb-20 bg-navy min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center max-w-xl mx-auto mb-10">
          <p className="font-hindi text-lg text-saffron mb-1">हमारे सदस्य</p>
          <h1 className="font-display text-3xl md:text-4xl text-cream">Members</h1>
        </header>

        {safeMembersList.length === 0 ? (
          <p className="text-center text-cream/50 py-12 text-sm">कोई सदस्य जानकारी उपलब्ध नहीं है।</p>
        ) : (
          <div 
            ref={ref} 
            className="group/grid reveal-stagger grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
          >
            {safeMembersList.map((m, index) => {
              const memberKey = m._id || m.id || `member-${index}`;
              const nameHindi = typeof m.nameHindi === 'string' ? m.nameHindi : (typeof m.name === 'string' ? m.name : '');
              const nameEnglish = typeof m.nameEnglish === 'string' && m.nameEnglish.trim() !== '' ? m.nameEnglish : (typeof m.name === 'string' && m.name !== nameHindi ? m.name : '');
              const roleEnglish = typeof m.roleEnglish === 'string' ? m.roleEnglish : (typeof m.role === 'string' ? m.role : (typeof m.designation === 'string' ? m.designation : 'Member'));
              const roleHindi = typeof m.roleHindi === 'string' ? m.roleHindi : (typeof m.designationHindi === 'string' ? m.designationHindi : '');
              const photo = typeof m.image === 'string' && m.image.trim().length > 0 ? m.image : (typeof m.photo === 'string' ? m.photo : '');
              const bio = typeof m.bio === 'string' && m.bio.trim() !== '' ? m.bio : (typeof m.description === 'string' ? m.description : '');
              const phone = typeof m.phone === 'string' ? m.phone : '';
              const email = typeof m.email === 'string' ? m.email : '';
              
              const initial = getInitialLetter(nameHindi, nameEnglish);
              const creatorName = getSafeCreatorName(m);

              return (
                <div
                  key={memberKey}
                  className="group/card bg-navy-2 border border-gold/15 rounded-3xl p-4 text-center flex flex-col justify-between 
                             w-full max-w-[300px] h-[410px] relative overflow-hidden shadow-xl
                             opacity-100 scale-100 transition-all duration-300 ease-out cursor-pointer
                             group-hover/grid:opacity-50
                             hover:!opacity-100 hover:!scale-105 hover:!-translate-y-2 hover:border-gold/60 hover:shadow-2xl hover:z-20"
                >
                  {/* Top Block */}
                  <div className="flex flex-col items-center w-full min-h-0">
                    
                    {/* Avatar Circle */}
                    <div className="w-28 h-28 rounded-full border-2 border-gold/40 p-1 flex items-center justify-center mb-2 shadow-2xl bg-navy shrink-0 transition-transform duration-300 group-hover/card:scale-105 overflow-hidden">
                      {photo ? (
                        <img
                          src={photo}
                          alt={nameEnglish || nameHindi || 'Member'}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-saffron/15 text-saffron font-display text-3xl font-bold flex items-center justify-center uppercase select-none">
                          {initial}
                        </div>
                      )}
                    </div>

                    {/* English & Hindi Names (Swapped Position) */}
                    {nameEnglish ? (
                      <>
                        <h3 className="text-base text-cream font-bold leading-tight truncate max-w-full group-hover/card:text-saffron transition-colors">
                          {nameEnglish}
                        </h3>
                        {nameHindi && (
                          <p className="font-hindi text-[11px] text-gold/80 font-medium mt-0.5 truncate max-w-full">
                            {nameHindi}
                          </p>
                        )}
                      </>
                    ) : (
                      <h3 className="font-hindi text-base text-cream font-bold leading-tight truncate max-w-full group-hover/card:text-saffron transition-colors">
                        {nameHindi || 'सदस्य'}
                      </h3>
                    )}

                    {/* Role Tag */}
                    <div className="mt-1 inline-flex flex-col items-center shrink-0">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron uppercase font-semibold tracking-wider border border-gold/20">
                        {roleEnglish}
                      </span>
                      {roleHindi && (
                        <span className="font-hindi text-[10px] text-gold/80 mt-0.5">{roleHindi}</span>
                      )}
                    </div>

                    {/* Fixed Height Bio with Invisible Scroll & Fade */}
                    {bio && (
                      <div className="relative w-full h-12 mt-1.5 px-1">
                        <div className="h-full overflow-y-auto pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                          <p className="font-hindi text-[11px] text-cream/75 leading-snug italic break-words">
                            {formatBio(bio)}
                          </p>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-navy-2 to-transparent pointer-events-none group-hover/card:opacity-0 transition-opacity duration-300" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer Block */}
                  <div className="w-full pt-2 border-t border-gold/10 space-y-1.5 shrink-0">
                    {(phone || email) && (
                      <div className="flex items-center justify-center gap-2 text-[10px] text-cream/60 flex-wrap">
                        {phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={10} className="text-saffron shrink-0" /> {phone}
                          </span>
                        )}
                        {email && (
                          <span className="flex items-center gap-1 truncate max-w-[130px]">
                            <Mail size={10} className="text-saffron shrink-0" /> {email}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Admin Attribution Badge */}
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center gap-1 text-[9px] text-gold font-medium bg-saffron/10 px-2.5 py-0.5 rounded-full border border-gold/20 shadow-sm">
                        <UserCheck size={10} className="text-saffron shrink-0" />
                        Posted by: {creatorName}
                      </span>
                    </div>
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