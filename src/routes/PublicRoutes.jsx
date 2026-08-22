import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Seva from '../pages/public/Seva';
import Events from '../pages/public/Events';
import Gallery from '../pages/public/Gallery';
import Members from '../pages/public/Members';
import Updates from '../pages/public/Updates';
import Donate from '../pages/public/Donate';
import Contact from '../pages/public/Contact';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import Terms from '../pages/public/Terms';
import Volunteer from '../pages/public/Volunteer';

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/seva" element={<Seva />} />
      <Route path="/events" element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/members" element={<Members />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/volunteer" element={<Volunteer />} />
    </Routes>
  );
}