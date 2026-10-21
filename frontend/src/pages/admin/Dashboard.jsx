import useApi from '../../hooks/useApi';
import { Loading } from '../../components/Layout';

export default function Dashboard() {
  const { data, loading, error } = useApi('/admin/stats');
  if (loading || error) return <Loading error={error} />;
  const cards = [['Total Turnamen', data.total_tournaments], ['Turnamen Aktif', data.active_tournaments],
    ['Total Team', data.total_teams], ['Total Pendaftaran', data.total_registrations]];
  return (
    <>
      <h1 className="mb-6 text-3xl font-extrabold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-surface p-5 shadow-sm"><p className="text-sm text-muted">{k}</p><p className="text-4xl font-extrabold">{v}</p></div>
        ))}
      </div>
    </>
  );
}
