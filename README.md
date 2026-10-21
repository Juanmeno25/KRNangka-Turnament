# KRNangka Turnamen
*Informasi Turnamen Desa Karangnangka* — React + Tailwind (frontend), Express (backend), MySQL (database).

Alur data: **Frontend → REST API → Backend → MySQL**.

## Prasyarat
Node.js 18+, MySQL 8 (atau MariaDB 10.5+).

## 1. Buat database MySQL
```bash
mysql -u root -p < database/schema.sql
```
Perintah ini membuat database `krnangka_turnamen`, 3 tabel (users, tournaments, registrations), dan 5 turnamen contoh.

## 2. Jalankan backend
```bash
cd backend
npm install
cp .env.example .env     # lalu isi DB_PASSWORD dan JWT_SECRET
npm run seed             # membuat akun admin (password di-hash bcrypt)
npm run dev              # http://localhost:5000
```
Akun admin testing: `admin@krnangka.id` (atau username `admin`) / `admin123`. Ganti lewat `.env` sebelum seed.

## 3. Jalankan frontend
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```
Vite meneruskan `/api` ke `http://localhost:5000`. Untuk deploy, set `VITE_API_URL`.

## Halaman
Peserta: `/`, `/tournaments`, `/tournaments/:id`, `/register/:id`
Admin: `/admin/login`, `/admin/dashboard`, `/admin/tournaments`, `/admin/registrations`

## API
| Method | Endpoint | Akses |
|---|---|---|
| POST | /api/auth/login, /api/auth/logout | publik |
| GET | /api/tournaments, /api/tournaments/:id | publik |
| POST | /api/tournaments/:id/registrations | publik |
| POST/PUT/DELETE | /api/tournaments(/:id) | admin |
| GET | /api/tournaments/:id/registrations, /api/registrations, /api/admin/stats | admin |
| PUT/DELETE | /api/registrations/:id | admin |

## Keamanan
bcrypt (bcryptjs), JWT + middleware `auth`/`adminOnly`, query berparameter (mysql2), validasi di frontend dan backend, kuota dicek dalam transaksi.

## Tema terang / gelap
Tombol matahari/bulan ada di header (dan di panel admin). Pilihan disimpan di `localStorage` (`krn_theme`); kunjungan pertama mengikuti pengaturan perangkat. Warna diatur lewat variabel CSS di `frontend/src/index.css` (`:root` dan `.dark`).

## Buka dari HP
`npm run dev` di frontend sudah memakai `host: true`. Buka `http://IP-LAPTOP:5173` dari HP (satu WiFi). Biarkan `VITE_API_URL` kosong: request `/api` diteruskan Vite ke backend di laptop, jadi tidak perlu ubah CORS.

## Tanggal buka pendaftaran
Setiap turnamen punya **Tanggal buka pendaftaran** (opsional) dan **Batas pendaftaran**. Status dihitung backend (`backend/utils/registrationState.js`) dengan urutan, dari yang paling kuat:
1. Ditutup manual oleh admin (tombol Tutup pendaftaran) selalu menang.
2. Belum dibuka: hari ini masih sebelum tanggal buka. Tampil "Dibuka 15 Oktober 2026", tombol daftar tidak muncul, dan API menolak pendaftar.
3. Lewat batas pendaftaran.
4. Kuota penuh.
5. Dibuka.

Tanggal dihitung menurut zona waktu `Asia/Jakarta` (ubah lewat `APP_TZ` di `backend/.env`).

**Database yang sudah berisi data**: jangan jalankan ulang `schema.sql` (itu menghapus data). Cukup:
```bash
mysql -u root -p krnangka_turnamen < database/migrate-registration-start.sql
```

## Kelola admin
Menu **Kelola Admin** di panel: tambah admin, ganti password, hapus. Password minimal 8 karakter dan disimpan ter-hash. Akun sendiri dan admin terakhir tidak bisa dihapus.
API (khusus admin): `GET /api/admins`, `POST /api/admins`, `PUT /api/admins/:id/password`, `DELETE /api/admins/:id`.
