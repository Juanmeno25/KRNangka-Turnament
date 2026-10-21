CREATE DATABASE IF NOT EXISTS krnangka_turnamen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE krnangka_turnamen;

DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(60) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time VARCHAR(30),
  location VARCHAR(150),
  registration_fee INT NOT NULL DEFAULT 0,
  prize VARCHAR(255),
  rules TEXT,
  max_teams INT NOT NULL DEFAULT 16,
  registration_start DATE NULL,
  registration_deadline DATE,
  status ENUM('open','closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  team_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  registration_status ENUM('menunggu','diterima','ditolak') NOT NULL DEFAULT 'menunggu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reg_tournament FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  UNIQUE KEY uq_team_per_tournament (tournament_id, team_name)
);

INSERT INTO tournaments (name, category, description, date, time, location, registration_fee, prize, rules, max_teams, registration_deadline, status) VALUES
('KRNangka Futsal Cup', 'Futsal', 'Turnamen futsal antar RT dan antar dusun se-Desa Karangnangka.', '2026-11-21', '08.00 WIB', 'Lapangan Futsal Balai Desa', 250000, 'Rp 3.000.000 + Piala', '1. Satu tim maksimal 10 pemain.\n2. Pemain wajib warga atau memiliki KTP Karangnangka.\n3. Sistem gugur, 2 x 10 menit.\n4. Keputusan wasit tidak dapat diganggu gugat.', 16, '2026-11-14', 'open'),
('KRNangka Volleyball Tournament', 'Voli', 'Turnamen bola voli putra dan putri untuk memeriahkan hari jadi desa.', '2026-12-05', '13.00 WIB', 'Lapangan Voli Dusun Tengah', 150000, 'Rp 2.000.000 + Piala', '1. Satu tim 6-10 pemain.\n2. Pertandingan best of 3 set.\n3. Tim wajib hadir 15 menit sebelum jadwal.', 12, '2026-11-28', 'open'),
('KRNangka Badminton Cup', 'Badminton', 'Turnamen bulutangkis ganda terbuka untuk warga desa.', '2026-11-28', '09.00 WIB', 'GOR Desa Karangnangka', 100000, 'Rp 1.500.000 + Piala', '1. Kategori ganda putra.\n2. Peserta membawa raket dan shuttlecock sendiri.\n3. Sistem gugur, best of 3 game.', 16, '2026-11-21', 'open'),
('KRNangka Mobile Legends Tournament', 'Mobile Legends', 'Turnamen e-sports Mobile Legends 5v5 untuk remaja dan pemuda desa.', '2026-12-12', '19.00 WIB', 'Aula Balai Desa (offline final)', 75000, 'Rp 1.000.000', '1. Satu tim 5 pemain + 1 cadangan.\n2. Dilarang menggunakan aplikasi pihak ketiga.\n3. Babak penyisihan online, final offline.', 16, '2026-12-05', 'open'),
('KRNangka Free Fire Tournament', 'Free Fire', 'Turnamen Free Fire mode squad antar pemuda dusun.', '2026-10-24', '19.30 WIB', 'Aula Balai Desa', 50000, 'Rp 750.000', '1. Satu squad 4 pemain.\n2. Pendaftaran sudah ditutup.', 12, '2026-10-17', 'closed');
