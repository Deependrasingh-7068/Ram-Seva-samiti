import { useMemo, useState } from 'react';
import SevaCard from '../components/SevaCard';
import useScrollReveal from '../hooks/useScrollReveal';
import { useAdmin } from '../context/AdminContext';

export default function Seva() {
  const ref = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const { seva = [] } = useAdmin();

  const categories = useMemo(() => {
    const validCats = (seva || [])
      .map((s) => s?.category?.trim())
      .filter((cat) => Boolean(cat));
    return ['All', ...new Set(validCats)];
  }, [seva]);

  const filtered = useMemo(() => {
    if (!Array.isArray(seva)) return [];
    if (activeCategory === 'All') return seva;
    return seva.filter((s) => s?.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [seva, activeCategory]);

  return (
    <div className="pt-32 pb-24 bg-navy min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-hindi text-2xl text-saffron mb-2">हमारी सेवा गतिविधियां</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream">Seva Activities</h1>
          <p className="text-cream/60 mt-4">
            समिति द्वारा संचालित सभी सेवा गतिविधियां, जो समाज को सशक्त बनाने के लिए समर्पित हैं।
          </p>
        </header>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-saffron text-navy font-medium shadow-md'
                  : 'text-cream/70 border border-gold/20 hover:border-gold/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div ref={ref} className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered && filtered.length > 0 ? (
            filtered.map((item) => {
              const sevaKey = item._id || item.id || Math.random();
              return <SevaCard key={sevaKey} {...item} id={sevaKey} enableModal={true} />;
            })
          ) : (
            <div className="col-span-full py-16 text-center text-sm text-cream/50 bg-navy-2/40 rounded-2xl border border-gold/10">
              No Seva activities found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}