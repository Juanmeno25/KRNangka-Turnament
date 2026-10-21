import { Link, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { Loading } from '../components/Layout';
import { Icon, QuotaBar, StatusPill } from '../components/ui';
import { fmtDate, rupiah, stateLabel } from '../services/api';

export default function TournamentDetail() {
  const { id } = useParams();
  const { data: t, loading, error } = useApi(`/tournaments/${id}`);
  if (loading || error) return <Loading error={error} />;
  const isOpen = t.registration_state === 'open';
  const rows = [
    ['calendar', 'Tanggal', fmtDate(t.date)], ['clock', 'Waktu', t.time || '-'], ['pin', 'Lokasi', t.location || '-'],
    ['wallet', 'Biaya pendaftaran', rupiah(t.registration_fee)], ['trophy', 'Hadiah', t.prize || '-'],
    ...(t.registration_start ? [['calendar', 'Pendaftaran dibuka', fmtDate(t.registration_start)]] : []),
    ['calendar', 'Batas pendaftaran', fmtDate(t.registration_deadline)],
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 pb-28 sm:pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill t={t} />
        <span className="font-semibold text-brand">{t.category}</span>
      </div>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{t.name}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{t.description}</p>

      <dl className="mt-8 grid gap-5 rounded-2xl border bg-surface p-6 sm:grid-cols-2">
        {rows.map(([icon, k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand"><Icon n={icon} className="h-5 w-5" /></span>
            <div><dt className="text-sm text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
          </div>
        ))}
        <div className="sm:col-span-2"><QuotaBar registered={t.registered} max={t.max_teams} /></div>
      </dl>

      <h2 className="mt-10 text-2xl font-bold">Peraturan</h2>
      <p className="mt-2 max-w-2xl whitespace-pre-line text-muted">{t.rules || 'Belum ada peraturan.'}</p>

      {isOpen ? (
        <>
          <Link to={`/register/${t.id}`} className="btn-p mt-8 hidden px-6 py-3 text-lg sm:inline-flex">Daftar turnamen</Link>
          <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-bg/95 p-3 backdrop-blur sm:hidden">
            <Link to={`/register/${t.id}`} className="btn-p w-full py-3 text-lg">Daftar turnamen</Link>
          </div>
        </>
      ) : (
        <p className="mt-8 rounded-lg bg-surface-2 p-4 font-semibold">{t.registration_state === 'upcoming'
          ? `Pendaftaran belum dibuka. Dibuka pada ${fmtDate(t.registration_start)}.`
          : `${stateLabel(t)}. Pendaftaran tidak dapat dilakukan.`}</p>
      )}
    </div>
  );
}
