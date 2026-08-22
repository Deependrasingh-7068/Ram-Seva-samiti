import { useState } from 'react';
import { Bell, ArrowRight, X } from 'lucide-react';

/**
 * Renders the currently published, in-date announcement.
 * In production, `announcement` is fetched from GET /api/announcements/active
 * (Announcement model) — the admin panel controls text, link, priority and
 * the publish window (startDate / endDate).
 */
const announcement = {
  message: 'राम नवमी महोत्सव हेतु पंजीकरण प्रारंभ हो चुका है।',
  linkLabel: 'View Details',
  linkTo: '/events/ram-navami-mahotsav-2026',
};

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (!announcement || dismissed) return null;

  return (
    <div className="relative z-30 bg-navy-2 border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2.5 flex items-center gap-3 text-sm">
        <Bell size={15} className="text-saffron shrink-0" aria-hidden="true" />
        <span className="text-cream/90 font-hindi truncate">{announcement.message}</span>
        <a
          href={announcement.linkTo}
          className="ml-auto shrink-0 inline-flex items-center gap-1 text-gold hover:text-saffron transition-colors whitespace-nowrap"
        >
          {announcement.linkLabel}
          <ArrowRight size={13} />
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 text-cream/50 hover:text-cream transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
