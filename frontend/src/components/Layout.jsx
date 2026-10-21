import { Link, NavLink, Outlet } from 'react-router-dom';
import { Icon, Logo, ThemeToggle } from './ui';
import { SOCIALS } from '../config/social';

export function Layout() {
  const link = ({ isActive }) => `rounded-lg px-3 py-2 font-semibold transition ${isActive ? 'bg-brand/15 text-brand' : 'hover:bg-surface-2'}`;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-bg/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
          <Link to="/" aria-label="KRNangka Turnamen, ke beranda"><Logo /></Link>
          <div className="flex items-center gap-1">
            <NavLink to="/" end className={link}>Beranda</NavLink>
            <NavLink to="/tournaments" className={link}>Turnamen</NavLink>
            <span className="ml-1"><ThemeToggle /></span>
          </div>
        </nav>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-hero py-8 text-sm text-white/75">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-bold text-white">KRNangka Turnamen</p>
          <p>Informasi Turnamen Desa Karangnangka</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Media sosial">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} ${s.handle} (buka di tab baru)`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {s.name}<Icon n="ext" className="h-3.5 w-3.5 opacity-70" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-white/55">© {new Date().getFullYear()} Desa Karangnangka. <Link to="/admin/login" className="underline">Masuk admin</Link></p>
        </div>
      </footer>
    </div>
  );
}

export const Loading = ({ error }) => error
  ? <p role="alert" className="p-10 text-center text-danger">{error}</p>
  : <p className="p-10 text-center text-muted">Memuat…</p>;
