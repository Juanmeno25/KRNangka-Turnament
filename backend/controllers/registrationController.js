const db = require('../config/db');
const { computeState, MESSAGES } = require('../utils/registrationState');

const STATUSES = ['menunggu', 'diterima', 'ditolak'];
const PHONE = /^(0|62)8\d{8,11}$/; // contoh: 081234567890 atau 6281234567890

exports.listAll = async (req, res) => {
  const [rows] = await db.query(`SELECT r.*, t.name AS tournament_name FROM registrations r
    JOIN tournaments t ON t.id = r.tournament_id ORDER BY r.created_at DESC`);
  res.json(rows);
};

exports.listByTournament = async (req, res) => {
  const [rows] = await db.query(
    `SELECT r.*, t.name AS tournament_name FROM registrations r JOIN tournaments t ON t.id = r.tournament_id
     WHERE r.tournament_id = ? ORDER BY r.created_at DESC`, [req.params.id]);
  res.json(rows);
};

exports.create = async (req, res) => {
  const team = (req.body.team_name || '').trim();
  const phone = (req.body.phone_number || '').trim();
  if (!team) return res.status(400).json({ message: 'Nama team wajib diisi' });
  if (!phone) return res.status(400).json({ message: 'Nomor telepon wajib diisi' });
  if (!/^\d+$/.test(phone)) return res.status(400).json({ message: 'Nomor telepon hanya boleh berisi angka' });
  if (!PHONE.test(phone)) return res.status(400).json({ message: 'Format nomor telepon tidak valid (contoh: 081234567890)' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [[t]] = await conn.query('SELECT * FROM tournaments WHERE id = ? FOR UPDATE', [req.params.id]);
    if (!t) { await conn.rollback(); return res.status(404).json({ message: 'Turnamen tidak ditemukan' }); }
    const [[{ n }]] = await conn.query(
      "SELECT COUNT(*) AS n FROM registrations WHERE tournament_id = ? AND registration_status <> 'ditolak'", [t.id]);
    const state = computeState(t, n);
    if (state !== 'open') { await conn.rollback(); return res.status(400).json({ message: MESSAGES[state] }); }
    await conn.query('INSERT INTO registrations (tournament_id, team_name, phone_number) VALUES (?,?,?)', [t.id, team, phone]);
    await conn.commit();
    res.status(201).json({ message: 'Pendaftaran berhasil' });
  } catch (e) {
    await conn.rollback();
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Nama team sudah terdaftar di turnamen ini' });
    throw e;
  } finally {
    conn.release();
  }
};

exports.update = async (req, res) => {
  const { registration_status } = req.body;
  if (!STATUSES.includes(registration_status)) return res.status(400).json({ message: 'Status tidak valid' });
  const [r] = await db.query('UPDATE registrations SET registration_status = ? WHERE id = ?', [registration_status, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
  res.json({ message: 'Status diperbarui' });
};

exports.remove = async (req, res) => {
  const [r] = await db.query('DELETE FROM registrations WHERE id = ?', [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
  res.json({ message: 'Pendaftaran dihapus' });
};
