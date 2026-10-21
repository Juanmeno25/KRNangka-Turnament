import { useState } from 'react';
import useApi from '../../hooks/useApi';
import { Loading } from '../../components/Layout';
import { api, fmtDate } from '../../services/api';

const EMPTY = { username: '', email: '', password: '' };

export default function AdminAdmins() {
  const { data, loading, error, reload } = useApi('/admins');
  const { data: me } = useApi('/auth/me');
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');

  const save = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await api('/admins', { method: 'POST', body: form });
      setNote(`Admin "${form.username}" ditambahkan.`); setForm(null); reload();
    } catch (x) { setMsg(x.message); }
  };
  const resetPw = async (a) => {
    const password = prompt(`Password baru untuk "${a.username}" (minimal 8 karakter):`);
    if (!password) return;
    try { await api(`/admins/${a.id}/password`, { method: 'PUT', body: { password } }); setNote(`Password "${a.username}" diperbarui.`); }
    catch (x) { alert(x.message); }
  };
  const del = async (a) => {
    if (!confirm(`Hapus admin "${a.username}"?`)) return;
    try { await api(`/admins/${a.id}`, { method: 'DELETE' }); setNote(`Admin "${a.username}" dihapus.`); reload(); }
    catch (x) { alert(x.message); }
  };

  if (loading || error) return <Loading error={error} />;
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold">Kelola Admin</h1>
        <button className="btn-p" onClick={() => { setNote(''); setMsg(''); setForm(EMPTY); }}>Tambah admin</button>
      </div>
      {note && <p role="status" className="mb-4 rounded-lg bg-brand/15 p-3 text-brand">{note}</p>}

      <table className="w-full min-w-[640px] rounded-xl border bg-surface text-left text-sm shadow-sm">
        <thead className="border-b text-muted"><tr>{['Username', 'Email', 'Dibuat', 'Aksi'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.id} className="border-b last:border-0">
              <td className="p-3 font-semibold">{a.username}{me?.user?.id === a.id && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-ink">Kamu</span>}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3">{fmtDate(a.created_at.slice(0, 10))}</td>
              <td className="flex flex-wrap gap-1 p-3">
                <button className="btn-o btn-s" onClick={() => resetPw(a)}>Ganti password</button>
                {me?.user?.id !== a.id && <button className="btn-o btn-s text-danger" onClick={() => del(a)}>Hapus</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {form && (
        <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={save} className="my-8 w-full max-w-md space-y-3 rounded-2xl border bg-surface p-6">
            <h2 className="text-2xl font-bold">Tambah admin</h2>
            <div><label className="label" htmlFor="au">Username</label>
              <input id="au" autoComplete="off" className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            <div><label className="label" htmlFor="ae">Email</label>
              <input id="ae" type="email" autoComplete="off" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label" htmlFor="ap">Password (minimal 8 karakter)</label>
              <input id="ap" type="password" autoComplete="new-password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            {msg && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-danger">{msg}</p>}
            <div className="flex justify-end gap-2"><button type="button" className="btn-o" onClick={() => setForm(null)}>Batal</button><button className="btn-p">Simpan</button></div>
          </form>
        </div>
      )}
    </>
  );
}
