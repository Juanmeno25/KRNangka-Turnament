import { useState } from 'react';
import useApi from '../../hooks/useApi';
import { Loading } from '../../components/Layout';
import { api, fmtDate } from '../../services/api';

export default function AdminRegistrations() {
  const { data, loading, error, reload } = useApi('/registrations');
  const { data: ts } = useApi('/tournaments');
  const [filter, setFilter] = useState('');
  if (loading || error) return <Loading error={error} />;
  const rows = data.filter((r) => !filter || String(r.tournament_id) === filter);
  const setStatus = async (r, s) => { await api(`/registrations/${r.id}`, { method: 'PUT', body: { registration_status: s } }); reload(); };
  const del = async (r) => { if (confirm(`Hapus pendaftaran team "${r.team_name}"?`)) { await api(`/registrations/${r.id}`, { method: 'DELETE' }); reload(); } };
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Data Pendaftaran</h1>
        <select aria-label="Filter turnamen" className="input !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Semua turnamen</option>
          {(ts || []).map((t) => <option key={t.id} value={t.id}>{t.name} ({t.registered})</option>)}
        </select>
      </div>
      <table className="w-full min-w-[760px] rounded-xl border bg-surface text-left text-sm shadow-sm">
        <thead className="border-b text-muted"><tr>{['No', 'Nama Turnamen', 'Nama Team', 'No. Telepon', 'Status', 'Tanggal Daftar', 'Aksi'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-muted">Belum ada pendaftaran.</td></tr>}
          {rows.map((r, i) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="p-3">{i + 1}</td><td className="p-3">{r.tournament_name}</td><td className="p-3 font-semibold">{r.team_name}</td><td className="p-3">{r.phone_number}</td>
              <td className="p-3">
                <select aria-label="Status" className="rounded border bg-surface px-2 py-1" value={r.registration_status} onChange={(e) => setStatus(r, e.target.value)}>
                  <option value="menunggu">Menunggu</option><option value="diterima">Diterima</option><option value="ditolak">Ditolak</option>
                </select>
              </td>
              <td className="p-3">{fmtDate(r.created_at.slice(0, 10))}</td>
              <td className="p-3"><button className="text-danger underline" onClick={() => del(r)}>Hapus</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
