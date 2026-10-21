import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { Loading } from '../components/Layout';
import { api, fmtDate, rupiah } from '../services/api';

export default function Register() {
  const { id } = useParams();
  const { data: t, loading, error } = useApi(`/tournaments/${id}`);
  const [form, setForm] = useState({ team_name: '', phone_number: '' });
  const [err, setErr] = useState({});
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  if (loading || error) return <Loading error={error} />;

  const validate = () => {
    const e = {};
    if (!form.team_name.trim()) e.team_name = 'Nama team wajib diisi';
    if (!form.phone_number) e.phone_number = 'Nomor telepon wajib diisi';
    else if (!/^\d+$/.test(form.phone_number)) e.phone_number = 'Nomor telepon hanya boleh berisi angka';
    else if (!/^(0|62)8\d{8,11}$/.test(form.phone_number)) e.phone_number = 'Format tidak valid (contoh: 081234567890)';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErr(e); setMsg('');
    if (Object.keys(e).length) return;
    setSending(true);
    try { await api(`/tournaments/${id}/registrations`, { method: 'POST', body: form }); setDone(true); }
    catch (x) { setMsg(x.message); }
    finally { setSending(false); }
  };

  if (done) return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div role="status" className="rounded-2xl bg-brand p-8 text-brand-ink">
        <h1 className="text-2xl font-bold">Pendaftaran berhasil</h1>
        <p className="mt-2">Team <b>{form.team_name}</b> sudah terdaftar di {t.name}. Panitia akan menghubungi nomor {form.phone_number}.</p>
      </div>
      <Link to="/tournaments" className="btn-o mt-6">Kembali ke daftar turnamen</Link>
    </div>
  );

  if (t.registration_state !== 'open') return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="rounded-lg bg-surface-2 p-4 font-semibold">{stateText(t)}</p>
      <Link to={`/tournaments/${t.id}`} className="btn-o mt-6">Kembali ke detail</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-extrabold">Daftar {t.name}</h1>
      <p className="mt-2 text-muted">{fmtDate(t.date)}, {t.location || '-'}. Biaya: {rupiah(t.registration_fee)}.</p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4 rounded-2xl border bg-surface p-6">
        <div>
          <label className="label" htmlFor="team">Nama Team</label>
          <input id="team" className="input" value={form.team_name} onChange={(e) => setForm({ ...form, team_name: e.target.value })} />
          {err.team_name && <p className="mt-1 text-sm text-danger">{err.team_name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="phone">Nomor Telepon</label>
          <input id="phone" inputMode="numeric" className="input" placeholder="081234567890" value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value.replace(/\D/g, '') })} />
          {err.phone_number && <p className="mt-1 text-sm text-danger">{err.phone_number}</p>}
        </div>
        {msg && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-danger">{msg}</p>}
        <button className="btn-p w-full" disabled={sending}>{sending ? 'Mengirim…' : 'Daftar Sekarang'}</button>
      </form>
    </div>
  );
}

const stateText = (t) => ({
  upcoming: `Pendaftaran belum dibuka. Dibuka pada ${fmtDate(t.registration_start)}.`,
  closed: 'Pendaftaran turnamen ini sudah ditutup.',
  expired: 'Batas waktu pendaftaran sudah lewat.',
  full: 'Kuota team sudah penuh.',
}[t.registration_state]);
