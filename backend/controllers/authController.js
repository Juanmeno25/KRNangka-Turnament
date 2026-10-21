const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ message: 'Username/email dan password wajib diisi' });
  const [rows] = await db.query('SELECT * FROM users WHERE (username = ? OR email = ?) AND role = "admin"', [identifier, identifier]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Username/email atau password salah' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '8h' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
};

// JWT stateless: logout dilakukan dengan menghapus token di klien.
exports.logout = (req, res) => res.json({ message: 'Berhasil logout' });

exports.me = (req, res) => res.json({ user: req.user });
