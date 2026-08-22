import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes';
import SuperAdminRoutes from './SuperAdminRoutes';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin Panel Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Super Admin Panel Routes */}
      <Route path="/superadmin/*" element={<SuperAdminRoutes />} />

      {/* Public Website Routes */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}