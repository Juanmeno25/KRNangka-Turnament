const BASE = import.meta.env.VITE_API_URL || '/api';
export const getToken = () => localStorage.getItem('krn_token');
export const setToken = (t) => (t ? localStorage.setItem('krn_token', t) : localStorage.removeItem('krn_token'));

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token && path !== '/auth/login') { setToken(null); window.location.href = '/admin/login'; }
    throw new Error(data.message || 'Terjadi kesalahan');
  }
  return data;
}

export const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
export const rupiah = (n) => (Number(n) ? 'Rp ' + Number(n).toLocaleString('id-ID') : 'Gratis');
export const STATE = {
  open: ['Pendaftaran Dibuka', 'bg-brand text-brand-ink'],
  upcoming: ['Belum Dibuka', 'bg-accent text-accent-ink'],
  closed: ['Pendaftaran Ditutup', 'bg-ink/10 text-ink'],
  expired: ['Pendaftaran Ditutup', 'bg-ink/10 text-ink'],
  full: ['Kuota Penuh', 'bg-danger text-danger-ink'],
};

// Label status. Untuk yang belum dibuka, sebut tanggalnya: "Dibuka 15 Oktober 2026".
export const stateLabel = (t) => t.registration_state === 'upcoming'
  ? 'Dibuka ' + fmtDate(t.registration_start)
  : STATE[t.registration_state][0];
