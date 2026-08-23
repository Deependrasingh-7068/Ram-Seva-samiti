import { Routes, Route } from 'react-router-dom';
import SuperAdminPanel from '../pages/SuperAdminnal'; // Ya SuperAdminDashboard ke anusaar
import SuperAdminLogin from '../pages/auth/SuperAdminLogin';

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<SuperAdminLogin />} />
      <Route path="/" element={<SuperAdminPanel />} />
    </Routes>
  );
}