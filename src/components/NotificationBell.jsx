import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bell, Trash2, Calendar, HeartHandshake, UserCheck, 
  Image as ImageIcon, BellRing, CheckCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NOTIF_API = `${import.meta.env.VITE_API_URL}/api/notifications/all`;

function getSectionRoute(section) {
  switch ((section || '').toLowerCase()) {
    case 'members':
    case 'member':
      return '/members';
    case 'events':
    case 'event':
      return '/events';
    case 'seva':
      return '/seva';
    case 'gallery':
      return '/gallery';
    case 'updates':
    case 'update':
      return '/updates';
    default:
      return '/';
  }
}

function getSectionIcon(section) {
  switch ((section || '').toLowerCase()) {
    case 'members':
    case 'member':
      return <UserCheck size={15} />;
    case 'events':
    case 'event':
      return <Calendar size={15} />;
    case 'gallery':
      return <ImageIcon size={15} />;
    case 'updates':
    case 'update':
      return <BellRing size={15} />;
    default:
      return <HeartHandshake size={15} />;
  }
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    // 1. Load from MongoDB Cloud Backend
    try {
      const res = await fetch(NOTIF_API);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          return;
        }
      }
    } catch {
      // Backend offline fallback to localStorage
    }

    // 2. Fallback to Local Storage
    try {
      const saved = JSON.parse(localStorage.getItem('samiti_notifications') || '[]');
      setNotifications(saved);
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Polling every 8 seconds for real-time cloud updates across all admins
    const pollInterval = setInterval(loadNotifications, 8000);

    const handleSync = () => {
      loadNotifications();
    };

    window.addEventListener('samiti_new_notification', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('samiti_trigger_db_sync', handleSync);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('samiti_new_notification', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('samiti_trigger_db_sync', handleSync);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loadNotifications]);

  const lastReadTimestamp = Number(localStorage.getItem('samiti_last_read_time') || '0');

  const unreadCount = notifications.filter((n) => {
    const itemTime = new Date(n.createdAt || n.timestamp).getTime();
    return itemTime > lastReadTimestamp && !n.read;
  }).length;

  const markAllAsRead = () => {
    localStorage.setItem('samiti_last_read_time', Date.now().toString());
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const saved = JSON.parse(localStorage.getItem('samiti_notifications') || '[]');
      const updated = saved.map((n) => ({ ...n, read: true }));
      localStorage.setItem('samiti_notifications', JSON.stringify(updated));
    } catch {
      // Local fallback safety
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('samiti_notifications');
    localStorage.setItem('samiti_last_read_time', Date.now().toString());
  };

  const toggleDropdown = () => {
    if (!open && unreadCount > 0) {
      markAllAsRead();
    }
    setOpen(!open);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative p-2.5 rounded-full bg-navy-2 border border-gold/20 text-gold hover:text-saffron hover:border-gold/50 transition-all cursor-pointer shadow-md"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-saffron text-navy text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md border border-navy">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Box */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-navy-2 border border-gold/30 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="p-4 border-b border-gold/15 flex items-center justify-between bg-navy/80">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-saffron" />
              <h4 className="font-display text-sm text-cream font-bold">समिति सूचनाएं</h4>
              <span className="text-[10px] bg-saffron/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">
                {notifications.length}
              </span>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-cream/50 hover:text-gold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Mark all read"
                >
                  <CheckCheck size={13} /> Read
                </button>
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="text-[11px] text-cream/50 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer ml-1"
                  title="Clear list"
                >
                  <Trash2 size={12} /> Clear
                </button>
              </div>
            )}
          </div>

          {/* List Container */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gold/10 [scrollbar-width:none]">
            {notifications.length > 0 ? (
              notifications.map((n, idx) => {
                const targetLink = getSectionRoute(n.section);
                const SectionIcon = getSectionIcon(n.section);
                const authorName = n.adminName || (n.adminEmail ? n.adminEmail.split('@')[0] : 'Admin');
                const timeString = n.createdAt
                  ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : (n.time || 'Just now');

                return (
                  <Link
                    key={n._id || n.id || idx}
                    to={targetLink}
                    onClick={() => setOpen(false)}
                    className="p-3.5 flex items-start gap-3 hover:bg-navy/60 transition-colors block group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center shrink-0 mt-0.5 border border-gold/15 group-hover:scale-105 transition-transform">
                      {SectionIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-cream font-medium leading-snug break-words group-hover:text-saffron transition-colors">
                        {n.message}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-cream/50 font-mono">
                        <span>By: <b className="text-gold/80 font-medium">{authorName}</b></span>
                        <span>{timeString}</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-10 text-center text-xs text-cream/40 flex flex-col items-center justify-center gap-1">
                <Bell size={24} className="text-cream/20 mb-1" />
                कोई नई सूचना नहीं है।
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}