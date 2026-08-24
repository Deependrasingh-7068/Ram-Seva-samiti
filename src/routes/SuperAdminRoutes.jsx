import { Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminPanel from '../pages/SuperAdminPanel';
import SuperAdminLogin from '../pages/auth/SuperAdminLogin';

// Guard: SuperAdminPanel tabhi khulega jab valid session (login se mila token) ho aur expire na hua ho
function RequireSuperAdmin({ children }) {
  try {
    const session = JSON.parse(localStorage.getItem('superAdminAuth') || 'null');
    const isValid = session && session.token && session.expiresAt > Date.now();
    return isValid ? children : <Navigate to="/superadmin/login" replace />;
  } catch (err) {
    return <Navigate to="/superadmin/login" replace />;
  }
}

export default function SuperAdminRoutes() {
  return (
    <div className="min-h-screen bg-navy text-cream">
      <Routes>
        <Route path="/login" element={<SuperAdminLogin />} />
        <Route
          path="/"
          element={
            <RequireSuperAdmin>
              <SuperAdminPanel />
            </RequireSuperAdmin>
          }
        />
        {/* Catch-all redirect to ensure wrong sub-paths fall back correctly */}
        <Route path="*" element={<Navigate to="/superadmin" replace />} />
      </Routes>
    </div>
  );
}