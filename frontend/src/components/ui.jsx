import { useState } from 'react';
import { STATE, stateLabel } from '../services/api';

const P = {
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  trophy: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  wallet: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  dash: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  list: <><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  ext: <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />,
  out: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
};
export const Icon = ({ n, className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 ${className}`}>{P[n]}</svg>
);

export function ThemeToggle({ onDark = false }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const flip = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('krn_theme', next ? 'dark' : 'light'); } catch {}
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', next ? '#0b1611' : '#f4f7f1');
  };
  const look = onDark ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'bg-surface text-ink hover:bg-surface-2';
  return (
    <button type="button" onClick={flip} aria-label={dark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'} title={dark ? 'Tema terang' : 'Tema gelap'}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${look}`}>
      <Icon n={dark ? 'sun' : 'moon'} className="h-5 w-5" />
    </button>
  );
}

export const Logo = () => (
  <span className="flex items-center gap-2.5 text-xl tracking-tight">
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-ink">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="6" /><path d="M12 3v18" /></svg>
    </span>
    <span><b className="font-extrabold">KRNangka</b> <span className="font-normal opacity-70">Turnamen</span></span>
  </span>
);

export const StatusPill = ({ t }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATE[t.registration_state][1]}`}>{stateLabel(t)}</span>
);

export function QuotaBar({ registered = 0, max = 0 }) {
  const pct = max ? Math.min(100, Math.round((registered / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="text-muted">Kuota team</span><span className="font-semibold">{registered}/{max}</span></div>
      <div role="progressbar" aria-label="Kuota team terisi" aria-valuenow={registered} aria-valuemin={0} aria-valuemax={max} className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${pct >= 100 ? 'bg-danger' : 'bg-brand'}`} style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}

export function DateStub({ date }) {
  if (!date) return null;
  const d = new Date(date + 'T00:00:00');
  return (
    <div className="w-14 shrink-0 overflow-hidden rounded-lg border bg-surface text-center leading-none">
      <div className="bg-accent py-1 text-xs font-bold text-accent-ink">{d.toLocaleDateString('id-ID', { month: 'short' })}</div>
      <div className="py-2 text-2xl font-extrabold">{d.getDate()}</div>
    </div>
  );
}

export const CardSkeletons = ({ n = 3 }) => (
  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: n }, (_, i) => <div key={i} className="skeleton h-72" />)}</div>
);

// Garis lapangan (futsal/voli/badminton punya pola serupa) untuk latar hero
export const CourtLines = ({ className = '' }) => (
  <svg viewBox="0 0 800 500" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" className={className}>
    <rect x="20" y="20" width="760" height="460" rx="6" />
    <path d="M400 20v460" /><circle cx="400" cy="250" r="70" /><circle cx="400" cy="250" r="5" fill="currentColor" />
    <path d="M20 150a100 100 0 0 1 0 200M780 150a100 100 0 0 0 0 200" />
    <rect x="20" y="200" width="44" height="100" /><rect x="736" y="200" width="44" height="100" />
  </svg>
);
