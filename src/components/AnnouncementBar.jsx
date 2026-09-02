import { useState, useEffect } from 'react';
import { Bell, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          console.error('VITE_API_URL is not configured.');
          return;
        }

        const response = await fetch(
          `${apiUrl}/api/registrations/active-campaign`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch announcement: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success && data.campaign) {
          setAnnouncement({
            message: data.campaign.bannerMessage,
            linkLabel: 'Register Now',
            linkTo: '/register',
          });
        }
      } catch (error) {
        console.error('Announcement fetch error:', error);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!announcement || dismissed) {
    return null;
  }

  return (
    <div className="relative z-30 bg-navy-2 border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2.5 flex items-center gap-3 text-sm">
        
        {/* Notification Icon */}
        <Bell
          size={15}
          className="text-saffron shrink-0"
          aria-hidden="true"
        />

        {/* Announcement Message */}
        <span className="text-cream/90 font-hindi truncate">
          {announcement.message}
        </span>

        {/* Register Button */}
        <Link
          to={announcement.linkTo}
          className="ml-auto shrink-0 inline-flex items-center gap-1 text-gold hover:text-saffron transition-colors whitespace-nowrap"
        >
          {announcement.linkLabel}
          <ArrowRight size={13} aria-hidden="true" />
        </Link>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 text-cream/50 hover:text-cream transition-colors"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}