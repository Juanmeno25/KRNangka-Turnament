const db = require('../config/db');
const { computeState } = require('../utils/registrationState');

const SELECT = `SELECT t.*, (SELECT COUNT(*) FROM registrations r
  WHERE r.tournament_id = t.id AND r.registration_status <> 'ditolak') AS registered FROM tournaments t`;

const withState = (t) => ({ ...t, registration_state: computeState(t, t.registered) });

const validate = (b) => {
  if (!b.name?.trim()) return 'Nama turnamen wajib diisi';
  if (!b.category?.trim()) return 'Jenis turnamen wajib diisi';
  if (!b.date) return 'Tanggal wajib diisi';
  if (!(Number(b.max_teams) > 0)) return 'Kuota team harus lebih dari 0';
  if (Number(b.registration_fee) < 0) return 'Biaya tidak boleh negatif';
  if (b.registration_start && b.registration_deadline && b.registration_start > b.registration_deadline)
    return 'Tanggal buka pendaftaran tidak boleh setelah batas pendaftaran';
  return null;
};

const values = (b) => [
  b.name.trim(), b.category.trim(), b.description || null, b.date, b.time || null, b.location || null,
  Number(b.registration_fee) || 0, b.prize || null, b.rules || null, Number(b.max_teams),
  b.registration_deadline || null, b.registration_start || null, b.status === 'closed' ? 'closed' : 'open',
];
const COLS = 'name,category,description,date,time,location,registration_fee,prize,rules,max_teams,registration_deadline,registration_start,status';

exports.list = async (req, res) => {
  const [rows] = await db.query(`${SELECT} ORDER BY t.date ASC`);
  res.json(rows.map(withState));
};

exports.get = async (req, res) => {
  const [rows] = await db.query(`${SELECT} WHERE t.id = ?`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Turnamen tidak ditemukan' });
  res.json(withState(rows[0]));
};

exports.create = async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ message: err });
  const [r] = await db.query(`INSERT INTO tournaments (${COLS}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, values(req.body));
  res.status(201).json({ id: r.insertId });
};

exports.update = async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ message: err });
  const set = COLS.split(',').map((c) => `${c} = ?`).join(', ');
  const [r] = await db.query(`UPDATE tournaments SET ${set} WHERE id = ?`, [...values(req.body), req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Turnamen tidak ditemukan' });
  res.json({ message: 'Turnamen diperbarui' });
};

exports.remove = async (req, res) => {
  const [r] = await db.query('DELETE FROM tournaments WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Turnamen tidak ditemukan' });
  res.json({ message: 'Turnamen dihapus' });
};

exports.stats = async (req, res) => {
  const [[s]] = await db.query(`SELECT
    (SELECT COUNT(*) FROM tournaments) AS total_tournaments,
    (SELECT COUNT(*) FROM tournaments WHERE status = 'open' AND (registration_deadline IS NULL OR registration_deadline >= CURDATE())) AS active_tournaments,
    (SELECT COUNT(DISTINCT team_name) FROM registrations) AS total_teams,
    (SELECT COUNT(*) FROM registrations) AS total_registrations`);
  res.json(s);
};
