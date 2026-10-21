import { Link } from 'react-router-dom';
import { DateStub, Icon, QuotaBar, StatusPill } from './ui';

export default function TournamentCard({ t }) {
  return (
    <article className="flex flex-col rounded-2xl border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <DateStub date={t.date} />
        <StatusPill t={t} />
      </div>
      <p className="mt-4 text-sm font-semibold text-brand">{t.category}</p>
      <h3 className="mt-0.5 text-xl font-bold leading-tight">{t.name}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li className="flex items-center gap-2"><Icon n="pin" />{t.location || '-'}</li>
        <li className="flex items-center gap-2"><Icon n="trophy" />{t.prize || '-'}</li>
      </ul>
      <div className="mt-4"><QuotaBar registered={t.registered} max={t.max_teams} /></div>
      <Link to={`/tournaments/${t.id}`} className="btn-p mt-5">Lihat detail</Link>
    </article>
  );
}
