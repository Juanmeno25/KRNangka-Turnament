// Membuat akun admin testing dengan password ter-hash (bcrypt).
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

(async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'admin@krnangka.id';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    `INSERT INTO users (username, email, password, role) VALUES (?,?,?, 'admin')
     ON DUPLICATE KEY UPDATE password = VALUES(password)`, [username, email, hash]);
  console.log(`Admin siap. Login: ${email} / ${password}`);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
