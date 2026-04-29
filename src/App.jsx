import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfileSetup } from '@/pages/ProfileSetup';
import { ResidentLayout } from '@/layouts/ResidentLayout';
import { OwnerLayout } from '@/layouts/OwnerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ResidentDashboard } from '@/pages/resident/ResidentDashboard';
import { Complaints } from '@/pages/resident/Complaints';
import { Payments } from '@/pages/resident/Payments';
import { Visitors } from '@/pages/resident/Visitors';
import { Resources } from '@/pages/resident/Resources';
import { Profile } from '@/pages/resident/Profile';
import { OwnerDashboard } from '@/pages/owner/OwnerDashboard';
import { OwnerFlats } from '@/pages/owner/OwnerFlats';
import { OwnerResidents } from '@/pages/owner/OwnerResidents';
import { OwnerPayments } from '@/pages/owner/OwnerPayments';
import { OwnerComplaints } from '@/pages/owner/OwnerComplaints';
import { OwnerVisitors } from '@/pages/owner/OwnerVisitors';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminOwners } from '@/pages/admin/AdminOwners';
import { AdminFlats } from '@/pages/admin/AdminFlats';
import { AdminResidents } from '@/pages/admin/AdminResidents';
import { AdminStaff } from '@/pages/admin/AdminStaff';
import { AdminComplaints } from '@/pages/admin/AdminComplaints';
import { AdminPayments } from '@/pages/admin/AdminPayments';
import { AdminVisitors } from '@/pages/admin/AdminVisitors';
import { AdminResources } from '@/pages/admin/AdminResources';

function LoginGate() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    if (!user?.profileComplete) {
      return <Navigate to="/profile-setup" replace />;
    }
    const to =
      user?.role === 'resident'
        ? '/resident/dashboard'
        : user?.role === 'owner'
          ? '/owner/dashboard'
          : '/admin/dashboard';
    return <Navigate to={to} replace />;
  }
  return <LoginPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginGate />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />

      <Route
        path="/resident"
        element={
          <ProtectedRoute role="resident">
            <ResidentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ResidentDashboard />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="payments" element={<Payments />} />
        <Route path="visitors" element={<Visitors />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/owner"
        element={
          <ProtectedRoute role="owner">
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="flats" element={<OwnerFlats />} />
        <Route path="residents" element={<OwnerResidents />} />
        <Route path="payments" element={<OwnerPayments />} />
        <Route path="complaints" element={<OwnerComplaints />} />
        <Route path="visitors" element={<OwnerVisitors />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="owners" element={<AdminOwners />} />
        <Route path="flats" element={<AdminFlats />} />
        <Route path="residents" element={<AdminResidents />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="visitors" element={<AdminVisitors />} />
        <Route path="resources" element={<AdminResources />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
