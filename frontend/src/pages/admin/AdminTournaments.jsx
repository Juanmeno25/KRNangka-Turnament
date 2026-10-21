import { useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { Loading } from '../../components/Layout';
import { api, fmtDate, stateLabel } from '../../services/api';

const EMPTY = { name: '', category: '', description: '', date: '', time: '', location: '', registration_fee: 0, prize: '', rules: '', max_teams: 16, registration_start: '', registration_deadline: '', status: 'open' };
const FIELDS = [['name', 'Nama turnamen'], ['category', 'Jenis / cabang (bebas, mis. Futsal, Catur)'], ['date', 'Tanggal', 'date'], ['time', 'Waktu'],
  ['location', 'Lokasi'], ['registration_fee', 'Biaya pendaftaran (Rp)', 'number'], ['prize', 'Hadiah'], ['max_teams', 'Kuota team', 'number'],
  ['registration_start', 'Tanggal buka pendaftaran', 'date'], ['registration_deadline', 'Batas pendaftaran', 'date']];

export default function AdminTournaments() {
  const { data, loading, error, reload } = useApi('/tournaments');
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await api(form.id ? `/tournaments/${form.id}` : '/tournaments', { method: form.id ? 'PUT' : 'POST', body: form });
      setForm(null); reload();
    } catch (x) { setMsg(x.message); }
  };
  const toggle = async (t) => { await api(`/tournaments/${t.id}`, { method: 'PUT', body: { ...t, status: t.status === 'open' ? 'closed' : 'open' } }); reload(); };
  const del = async (t) => { if (confirm(`Hapus "${t.name}" beserta semua pendaftarannya?`)) { await api(`/tournaments/${t.id}`, { method: 'DELETE' }); reload(); } };

  if (loading || error) return <Loading error={error} />;
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Kelola Turnamen</h1>
        <button className="btn-p" onClick={() => setForm(EMPTY)}>Tambah turnamen</button>
      </div>
      <table className="w-full min-w-[720px] rounded-xl border bg-surface text-left text-sm shadow-sm">
        <thead className="border-b text-muted"><tr>{['Nama', 'Jenis', 'Tanggal', 'Team', 'Status', 'Aksi'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>
          {data.map((t) => (
            <tr key={t.id} className="border-b last:border-0">
              <td className="p-3 font-semibold">{t.name}</td><td className="p-3">{t.category}</td><td className="p-3">{fmtDate(t.date)}</td>
              <td className="p-3">{t.registered}/{t.max_teams}</td><td className="p-3">{stateLabel(t)}</td>
              <td className="flex flex-wrap gap-1 p-3">
                <Link className="btn-o !px-2 !py-1" to={`/tournaments/${t.id}`}>Detail</Link>
                <button className="btn-o !px-2 !py-1" onClick={() => setForm({ ...EMPTY, ...t })}>Edit</button>
                <button className="btn-o !px-2 !py-1" onClick={() => toggle(t)}>{t.status === 'open' ? 'Tutup' : 'Buka'} pendaftaran</button>
                <button className="btn-o !px-2 !py-1 text-danger" onClick={() => del(t)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-3 rounded-2xl border bg-surface p-6">
            <h2 className="text-2xl font-bold">{form.id ? 'Edit' : 'Tambah'} turnamen</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {FIELDS.map(([k, l, type]) => (
                <div key={k}><label className="label" htmlFor={k}>{l}</label>
                  <input id={k} type={type || 'text'} className="input" value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
              ))}
            </div>
            {[['description', 'Deskripsi'], ['rules', 'Peraturan']].map(([k, l]) => (
              <div key={k}><label className="label" htmlFor={k}>{l}</label>
                <textarea id={k} rows="3" className="input" value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
            <div><label className="label" htmlFor="st">Status pendaftaran</label>
              <select id="st" className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="open">Dibuka</option><option value="closed">Ditutup</option></select></div>
            <p className="text-sm text-muted">Kosongkan tanggal buka untuk membuka pendaftaran langsung. Tombol Tutup pendaftaran selalu menang atas tanggal.</p>
            {msg && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-danger">{msg}</p>}
            <div className="flex justify-end gap-2"><button type="button" className="btn-o" onClick={() => setForm(null)}>Batal</button><button className="btn-p">Simpan</button></div>
          </form>
        </div>
      )}
    </>
  );
}
