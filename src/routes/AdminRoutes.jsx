import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Profile from '../pages/admin/Profile';
import HomeManagement from '../pages/admin/Home/HomeManagement';
import AboutManagement from '../pages/admin/About/AboutManagement';
import SevaManagement from '../pages/admin/Seva/SevaManagement';
import EventsManagement from '../pages/admin/Events/EventsManagement';
import GalleryManagement from '../pages/admin/Gallery/GalleryManagement';
import MembersManagement from '../pages/admin/Members/MembersManagement';
import UpdatesManagement from '../pages/admin/Updates/UpdatesManagement';
import DonateManagement from '../pages/admin/Donate/DonateManagement';
import ContactManagement from '../pages/admin/Contact/ContactManagement';
import PrivacyManagement from '../pages/admin/Privacy/PrivacyManagement';
import TermsManagement from '../pages/admin/Terms/TermsManagement';
import VolunteerManagement from '../pages/admin/Volunteer/VolunteerManagement';
import AdminManagement from '../pages/admin/Admins/AdminManagement';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="home" element={<HomeManagement />} />
        <Route path="about" element={<AboutManagement />} />
        <Route path="seva" element={<SevaManagement />} />
        <Route path="events" element={<EventsManagement />} />
        <Route path="gallery" element={<GalleryManagement />} />
        <Route path="members" element={<MembersManagement />} />
        <Route path="updates" element={<UpdatesManagement />} />
        <Route path="donate" element={<DonateManagement />} />
        <Route path="contact" element={<ContactManagement />} />
        <Route path="privacy" element={<PrivacyManagement />} />
        <Route path="terms" element={<TermsManagement />} />
        <Route path="volunteer" element={<VolunteerManagement />} />
        <Route path="admins" element={<AdminManagement />} />
      </Route>
    </Routes>
  );
}