import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import AnnouncementBar from './components/AnnouncementBar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

// Layouts
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Seva from './pages/Seva';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Gallery from './pages/Gallery';
import Members from './pages/Members';
import Updates from './pages/Updates';
import UpdateDetails from './pages/UpdateDetails';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard'; 
import SuperAdminRoutes from './routes/SuperAdminRoutes';

// Admin Components
import AdminPrivacyPolicy from './components/AdminPrivacyPolicy';
import AdminTerms from './components/AdminTerms';

// Office Bearer Pages
import OfficeBearerLogin from './pages/OfficeBearerLogin';
import OfficeBearerPanel from './pages/OfficeBearerPanel';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppShell() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Check if current route belongs to admin, superadmin or office bearer dashboard
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                       location.pathname.startsWith('/superadmin') || 
                       location.pathname.startsWith('/office-bearer');
                       
  const { authOpen, setAuthOpen } = useAuth();

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}

      <div className={loading ? 'invisible h-screen overflow-hidden' : 'visible'}>
        <ScrollToTop />

        {!isAdminRoute && (
          <header className="fixed top-0 left-0 w-full z-[100] flex flex-col">
            <AnnouncementBar />
            <Navbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((o) => !o)} />
          </header>
        )}

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

        <main className={isAdminRoute ? '' : 'pt-[100px] md:pt-[120px]'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/seva" element={<Seva />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/members" element={<Members />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/updates/:slug" element={<UpdateDetails />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Super Admin Routes */}
            <Route path="/superadmin/*" element={<SuperAdminRoutes />} />

            {/* Office Bearer Routes */}
            <Route path="/office-bearer/login" element={<OfficeBearerLogin />} />
            <Route path="/office-bearer/panel" element={<OfficeBearerPanel />} />

            {/* Admin Dashboard Layout Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="home" element={<AdminDashboard />} />
              <Route path="about" element={<AdminDashboard />} />
              <Route path="seva" element={<AdminDashboard />} />
              <Route path="events" element={<AdminDashboard />} />
              <Route path="gallery" element={<AdminDashboard />} />
              <Route path="members" element={<AdminDashboard />} />
              <Route path="updates" element={<AdminDashboard />} />
              <Route path="donate" element={<AdminDashboard />} />
              <Route path="volunteer-requests" element={<AdminDashboard />} />
              <Route path="srss-volunteers" element={<AdminDashboard />} />
              <Route path="privacy" element={<AdminPrivacyPolicy />} />
              <Route path="terms" element={<AdminTerms />} />
              <Route path="volunteer" element={<AdminDashboard />} />
              <Route path="admins" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <AppShell />
      </AdminProvider>
    </AuthProvider>
  );
}