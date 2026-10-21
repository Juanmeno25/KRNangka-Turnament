const bcrypt = require('bcryptjs');
const db = require('../config/db');

const USERNAME = /^[a-zA-Z0-9_.-]{3,50}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const checkPassword = (p) => (typeof p === 'string' && p.length >= 8 ? null : 'Password minimal 8 karakter');

exports.list = async (req, res) => {
  const [rows] = await db.query("SELECT id, username, email, created_at FROM users WHERE role = 'admin' ORDER BY id");
  res.json(rows);
};

exports.create = async (req, res) => {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  if (!USERNAME.test(username)) return res.status(400).json({ message: 'Username 3-50 karakter: huruf, angka, titik, strip, atau garis bawah' });
  if (!EMAIL.test(email)) return res.status(400).json({ message: 'Format email tidak valid' });
  const pwErr = checkPassword(req.body.password);
  if (pwErr) return res.status(400).json({ message: pwErr });
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const [r] = await db.query("INSERT INTO users (username, email, password, role) VALUES (?,?,?, 'admin')", [username, email, hash]);
    res.status(201).json({ id: r.insertId, username, email });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Username atau email sudah dipakai admin lain' });
    throw e;
  }
};

exports.setPassword = async (req, res) => {
  const pwErr = checkPassword(req.body.password);
  if (pwErr) return res.status(400).json({ message: pwErr });
  const hash = await bcrypt.hash(req.body.password, 10);
  const [r] = await db.query("UPDATE users SET password = ? WHERE id = ? AND role = 'admin'", [hash, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Admin tidak ditemukan' });
  res.json({ message: 'Password diperbarui' });
};

exports.remove = async (req, res) => {
  if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: 'Kamu tidak bisa menghapus akunmu sendiri' });
  const [[{ n }]] = await db.query("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'");
  if (n <= 1) return res.status(400).json({ message: 'Tidak bisa menghapus admin terakhir' });
  const [r] = await db.query("DELETE FROM users WHERE id = ? AND role = 'admin'", [req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Admin tidak ditemukan' });
  res.json({ message: 'Admin dihapus' });
};
