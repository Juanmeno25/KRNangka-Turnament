import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { api, getToken, setToken } from '../services/api';
import { Icon, Logo, ThemeToggle } from './ui';

const NAV = [['/admin/dashboard', 'dash', 'Dashboard'], ['/admin/tournaments', 'trophy', 'Kelola Turnamen'], ['/admin/registrations', 'list', 'Data Pendaftaran'], ['/admin/admins', 'users', 'Kelola Admin']];

export default function AdminLayout() {
  const nav = useNavigate();
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  const logout = async () => { try { await api('/auth/logout', { method: 'POST' }); } catch {} setToken(null); nav('/admin/login'); };
  const base = 'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 font-semibold transition';
  const link = ({ isActive }) => `${base} ${isActive ? 'bg-accent text-accent-ink' : 'text-white/80 hover:bg-white/10'}`;
  return (
    <div className="flex min-h-screen flex-col bg-bg md:flex-row">
      <aside className="bg-hero p-4 text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
        <div className="mb-4 flex items-center justify-between gap-2">
          <Logo />
          <ThemeToggle onDark />
        </div>
        <p className="mb-2 hidden px-3 text-sm text-white/55 md:block">Panel admin</p>
        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 md:mx-0 md:flex-col md:px-0">
          {NAV.map(([to, icon, label]) => <NavLink key={to} to={to} className={link}><Icon n={icon} className="h-5 w-5" />{label}</NavLink>)}
          <button onClick={logout} className={`${base} text-left text-red-300 hover:bg-white/10 md:mt-4`}><Icon n="out" className="h-5 w-5" />Logout</button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 overflow-x-auto p-4 md:p-8"><Outlet /></main>
    </div>
  );
}
