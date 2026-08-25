import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, UserCheck, BellRing } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import initialUpdates from '../data/updates';
import NotFound from './NotFound';
import OBBadge from '../components/OBBadge';

function formatDate(iso) {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDescription(desc) {
  if (!desc || typeof desc !== 'string') return '';
  const trimmed = desc.trim().replace(/^["“']+|["”']+$/g, '');
  return `“${trimmed}”`;
}

export default function UpdateDetails() {
  const { slug } = useParams();
  const { updates = [] } = useAdmin();

  // Combine dynamic context updates with static fallback
  const allUpdates = updates && updates.length > 0 ? updates : initialUpdates;

  // Match via slug, MongoDB _id, or id
  const update = allUpdates.find(
    (u) => u.slug === slug || u._id === slug || String(u.id) === String(slug)
  );

  if (!update) return <NotFound />;

  const creatorName =
    update.adminName ||
    (update.createdBy ? update.createdBy.split('@')[0] : update.author || 'Samiti Office');
  const fullContent = update.content || update.description || update.excerpt;

  return (
    <div className="pt-32 pb-24 bg-navy min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        {/* Navigation back */}
        <Link
          to="/updates"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream/60 hover:text-saffron transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Updates
        </Link>

        {/* Notice Card Container */}
        <div className="bg-navy-2 border border-gold/20 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6">
          {/* Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-5 border-b border-gold/15">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-saffron/15 text-saffron uppercase tracking-widest border border-gold/20">
                {update.category || 'NOTICE'}
              </span>
              {update.date && (
                <span className="flex items-center gap-1.5 text-cream/65 font-medium">
                  <Calendar size={13} className="text-saffron shrink-0" />
                  {formatDate(update.date)}
                </span>
              )}
            </div>

                       <OBBadge postedByRole={update.postedByRole} adminName={update.adminName} createdBy={update.createdBy} authorName={update.authorName} bearerDesignation={update.bearerDesignation} />
          </div>

          {/* Notice Title */}
          <h1 className="font-hindi text-2xl md:text-3xl text-cream font-bold leading-snug">
            {update.title}
          </h1>

          {/* Excerpt Banner (if present alongside detailed content) */}
          {update.excerpt && update.content && update.excerpt !== update.content && (
            <div className="p-4 rounded-xl bg-navy/60 border-l-4 border-saffron text-cream/70 italic text-sm">
              {update.excerpt}
            </div>
          )}

          {/* Detailed Content with Quotation Format */}
          <div className="font-hindi text-sm md:text-base text-cream/85 leading-relaxed whitespace-pre-line bg-navy/40 p-6 rounded-2xl border border-gold/10 shadow-inner">
            {formatDescription(fullContent)}
          </div>
        </div>
      </div>
    </div>
  );
}