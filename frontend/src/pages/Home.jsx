import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import TournamentCard from '../components/TournamentCard';
import { SOCIALS } from '../config/social';
import { CardSkeletons, CourtLines, DateStub, Icon, QuotaBar, StatusPill } from '../components/ui';

const STEPS = [
  ['Pilih turnamen', 'Buka halaman turnamen, lalu cek jadwal, biaya, dan peraturannya.'],
  ['Isi data team', 'Cukup nama team dan nomor telepon. Tidak perlu membuat akun.'],
  ['Tunggu kabar panitia', 'Panitia akan menghubungi nomor yang kamu daftarkan.'],
];

export default function Home() {
  const { data, loading, error } = useApi('/tournaments');
  const today = new Date().toLocaleDateString('sv-SE');
  const all = [...(data || [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const open = all.filter((t) => t.registration_state === 'open');
  const next = open.find((t) => t.date >= today) || open[0];
  const upcoming = all.filter((t) => t.date >= today).slice(0, 5);

  return (
    <>
      <section className="relative overflow-hidden bg-hero text-white">
        <CourtLines className="pointer-events-none absolute -right-32 top-1/2 w-[900px] max-w-none -translate-y-1/2 text-white/[0.07]" />
        <div className="hero-in relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">KRNangka Turnamen</h1>
            <p className="mt-4 text-2xl text-accent sm:text-3xl">Informasi Turnamen Desa Karangnangka</p>
            <p className="mt-5 max-w-xl text-lg text-white/75">Cari turnamen futsal, voli, badminton sampai e-sports di desa kita, lalu daftarkan team kamu tanpa perlu membuat akun.</p>
            <Link to="/tournaments" className="btn-y mt-8 px-6 py-3 text-lg">Lihat turnamen</Link>
          </div>
          {loading ? <div className="skeleton h-72 !bg-white/10" /> : next && (
            <div className="rounded-2xl border bg-surface p-5 text-ink shadow-xl">
              <p className="text-sm font-semibold text-muted">Pendaftaran terdekat</p>
              <div className="mt-3 flex items-start gap-3">
                <DateStub date={next.date} />
                <div className="min-w-0">
                  <h2 className="text-xl font-bold leading-tight">{next.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Icon n="pin" />{next.location || '-'}</p>
                </div>
              </div>
              <div className="mt-4"><QuotaBar registered={next.registered} max={next.max_teams} /></div>
              <Link to={`/register/${next.id}`} className="btn-p mt-5 w-full">Daftar sekarang</Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-3xl font-bold">Pendaftaran sedang dibuka</h2>
          <Link to="/tournaments" className="font-semibold text-brand underline-offset-4 hover:underline">Lihat semua turnamen</Link>
        </div>
        {loading ? <CardSkeletons /> : error ? <p role="alert" className="mt-4 text-danger">{error}</p> : open.length === 0
          ? <p className="mt-4 text-muted">Belum ada turnamen yang membuka pendaftaran.</p>
          : <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{open.slice(0, 3).map((t) => <TournamentCard key={t.id} t={t} />)}</div>}
      </section>

      <section className="border-y bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">Jadwal turnamen</h2>
          {upcoming.length === 0 && !loading && <p className="mt-4 text-muted">Belum ada jadwal turnamen.</p>}
          <ul className="mt-6 divide-y">
            {upcoming.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-4 py-4">
                <DateStub date={t.date} />
                <div className="min-w-0 flex-1">
                  <Link to={`/tournaments/${t.id}`} className="text-lg font-semibold hover:text-brand">{t.name}</Link>
                  <p className="text-sm text-muted">{t.category}, {t.location || '-'}</p>
                </div>
                <StatusPill t={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">Cara mendaftar</h2>
        <p className="mt-3 max-w-2xl text-muted">Panitia mengelola jadwal, hadiah, dan pendaftaran di satu tempat, jadi informasi yang kamu lihat selalu yang terbaru.</p>
        <ol className="mt-8 grid gap-5 sm:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="rounded-2xl border bg-surface p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-brand-ink">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-1 text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">Ikuti kami</h2>
          <p className="mt-3 max-w-2xl text-muted">Dokumentasi pertandingan dan kabar turnamen terbaru ada di media sosial kami.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} ${s.handle} (buka di tab baru)`}
                  className="flex items-center justify-between gap-3 rounded-2xl border bg-bg p-4 transition hover:border-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <span className="min-w-0"><span className="block font-bold">{s.name}</span><span className="block truncate text-sm text-muted">{s.handle}</span></span>
                  <Icon n="ext" className="h-5 w-5 text-brand" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
