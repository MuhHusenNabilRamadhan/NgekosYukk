-- TODO: Tulis query SQL kalian di sini (CREATE TABLE & INSERT) untuk inisialisasi database otomatis
-- init.sql
CREATE TABLE IF NOT EXISTS pemilik_kos (
    id_pemilik INT AUTO_INCREMENT PRIMARY KEY,
    nama_pemilik VARCHAR(100),
    no_hp VARCHAR(20),
    alamat TEXT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS penyewa (
    id_penyewa INT AUTO_INCREMENT PRIMARY KEY,
    nama_penyewa VARCHAR(100),
    no_hp VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS kamar (
    id_kamar INT AUTO_INCREMENT PRIMARY KEY,
    jenis_kamar VARCHAR(50),
    deskripsi TEXT,
    status_kamar ENUM('Tersedia', 'Terisi', 'Booking') DEFAULT 'Tersedia',
    harga DECIMAL(10, 2),
    id_penyewa INT NULL,
    FOREIGN KEY (id_penyewa) REFERENCES penyewa(id_penyewa) ON DELETE SET NULL
);

-- Data Dummy
INSERT INTO pemilik_kos (nama_pemilik, no_hp, alamat, username, password) 
VALUES ('Pak Rizal', '0812345', 'Jakarta', 'admin', 'admin123');

INSERT INTO kamar (jenis_kamar, deskripsi, status_kamar, harga) 
VALUES ('VIP', 'AC, Kamar Mandi Dalam', 'Tersedia', 1500000);