import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminPanel from '../pages/SuperAdminPanel';
import SuperAdminLogin from '../pages/auth/SuperAdminLogin';

// Guard: SuperAdminPanel tabhi khulega jab valid session (login se mila token) ho
function RequireSuperAdmin({ children }) {
  const session = JSON.parse(localStorage.getItem('superAdminAuth') || 'null');
  const isValid = session && session.token && session.expiresAt > Date.now();
  return isValid ? children : <Navigate to="/superadmin/login" replace />;
}

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<SuperAdminLogin />} />
      <Route
        path="/"
        element={
          <RequireSuperAdmin>
            <SuperAdminPanel />
          </RequireSuperAdmin>
        }
      />
    </Routes>
  );
}