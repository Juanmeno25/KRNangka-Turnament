import { useState } from 'react';
import useApi from '../hooks/useApi';
import TournamentCard from '../components/TournamentCard';
import { CardSkeletons } from '../components/ui';

export default function Tournaments() {
  const { data, loading, error } = useApi('/tournaments');
  const [cat, setCat] = useState('');
  const cats = [...new Set((data || []).map((t) => t.category).filter(Boolean))];
  const list = (data || []).filter((t) => !cat || t.category === cat);
  const chip = (on) => `rounded-full border px-4 py-2 text-sm font-semibold transition ${on ? 'border-ink bg-ink text-bg' : 'bg-surface hover:bg-surface-2'}`;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">Daftar Turnamen</h1>
      {cats.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter jenis turnamen">
          <button className={chip(!cat)} aria-pressed={!cat} onClick={() => setCat('')}>Semua</button>
          {cats.map((c) => <button key={c} className={chip(cat === c)} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      )}
      {loading ? <CardSkeletons n={6} /> : error ? <p role="alert" className="mt-8 text-danger">{error}</p> : list.length === 0
        ? <p className="mt-8 text-muted">Belum ada turnamen untuk ditampilkan.</p>
        : <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <TournamentCard key={t.id} t={t} />)}</div>}
    </div>
  );
}
