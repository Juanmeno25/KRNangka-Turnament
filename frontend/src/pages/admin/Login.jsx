import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../services/api';
import { Logo, ThemeToggle } from '../../components/ui';

export default function Login() {
  const nav = useNavigate();
  const [f, setF] = useState({ identifier: '', password: '' });
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setSending(true);
    try { const d = await api('/auth/login', { method: 'POST', body: f }); setToken(d.token); nav('/admin/dashboard'); }
    catch (x) { setErr(x.message); }
    finally { setSending(false); }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border bg-surface p-6 shadow-sm">
        <Logo />
        <h1 className="pt-2 text-2xl font-extrabold">Login admin</h1>
        <div><label className="label" htmlFor="id">Username atau email</label>
          <input id="id" autoComplete="username" className="input" value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} /></div>
        <div><label className="label" htmlFor="pw">Password</label>
          <input id="pw" type="password" autoComplete="current-password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        {err && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-danger">{err}</p>}
        <button className="btn-p w-full" disabled={sending}>{sending ? 'Memeriksa…' : 'Masuk'}</button>
      </form>
    </div>
  );
}
