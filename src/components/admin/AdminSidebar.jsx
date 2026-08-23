import { NavLink } from 'react-router-dom';
import { Home, Image, Users, Calendar, HeartHandshake, FileText, Bell, Info, Shield } from 'lucide-react'; // 'Shield' yahan import karna zaroori hai

const SECTIONS = [
  { name: 'Home', path: '/admin/home', icon: Home },
  { name: 'About', path: '/admin/about', icon: Info },
  { name: 'Seva', path: '/admin/seva', icon: HeartHandshake },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Gallery', path: '/admin/gallery', icon: Image },
  { name: 'Members', path: '/admin/members', icon: Users },
  { name: 'Updates', path: '/admin/updates', icon: Bell },
  { name: 'Donate', path: '/admin/donate', icon: HeartHandshake },
  { name: 'Contact', path: '/admin/contact', icon: FileText },
  { name: 'Privacy Policy', path: '/admin/privacy', icon: FileText },
  { name: 'Terms', path: '/admin/terms', icon: FileText },
  { name: 'Volunteer', path: '/admin/volunteer', icon: Users },
  { name: 'Manage Admins', path: '/admin/admins', icon: Shield }, // Yeh section yahan map ho jayega
];

export default function AdminSidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="w-64 bg-navy-2 border-r border-gold/10 flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="p-5 border-b border-gold/10">
        <h2 className="font-display text-lg text-saffron tracking-wide">Samiti Admin</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.name.toLowerCase();
          return (
            <button
              key={sec.name}
              onClick={() => setActiveSection(sec.name.toLowerCase())}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-saffron text-navy font-semibold' : 'text-cream/80 hover:bg-navy hover:text-saffron'
              }`}
            >
              <Icon size={18} />
              {sec.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}