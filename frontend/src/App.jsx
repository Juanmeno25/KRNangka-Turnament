import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Register from './pages/Register';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminTournaments from './pages/admin/AdminTournaments';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminAdmins from './pages/admin/AdminAdmins';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<TournamentDetail />} />
        <Route path="/register/:id" element={<Register />} />
      </Route>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tournaments" element={<AdminTournaments />} />
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="admins" element={<AdminAdmins />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
