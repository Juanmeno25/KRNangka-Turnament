-- Jalankan SEKALI pada database yang sudah berisi data (schema.sql akan menghapus data lama).
-- mysql -u root -p krnangka_turnamen < database/migrate-registration-start.sql
ALTER TABLE tournaments
  ADD COLUMN registration_start DATE NULL AFTER registration_deadline;
