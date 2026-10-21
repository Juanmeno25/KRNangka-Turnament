// Satu-satunya tempat aturan status pendaftaran. Dipakai oleh daftar/detail turnamen
// dan oleh endpoint pendaftaran, jadi tampilan dan validasi selalu sama.
const TZ = process.env.APP_TZ || 'Asia/Jakarta';

// Tanggal hari ini (YYYY-MM-DD) menurut zona waktu desa, bukan UTC server.
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: TZ });

// Urutan, dari yang paling kuat:
// closed (ditutup manual) > upcoming (belum tanggal buka) > expired (lewat batas) > full (kuota) > open
function computeState(t, registered) {
  const now = today();
  if (t.status === 'closed') return 'closed';
  if (t.registration_start && t.registration_start > now) return 'upcoming';
  if (t.registration_deadline && t.registration_deadline < now) return 'expired';
  if (registered >= t.max_teams) return 'full';
  return 'open';
}

const MESSAGES = {
  closed: 'Pendaftaran turnamen ini sudah ditutup',
  upcoming: 'Pendaftaran turnamen ini belum dibuka',
  expired: 'Batas waktu pendaftaran sudah lewat',
  full: 'Kuota team sudah penuh',
};

module.exports = { today, computeState, MESSAGES };
