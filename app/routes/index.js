const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 1. Halaman Utama (Penyewa)
router.get('/', async (req, res) => {
    try {
        const filterStatus = req.query.status;
        let sql = 'SELECT * FROM kamar';
        let params = [];

        if (filterStatus) {
            sql += ' WHERE status_kamar = ?';
            params.push(filterStatus);
        }

        const [results] = await db.query(sql, params);
        res.render('index', { 
            kamars: results, 
            currentFilter: filterStatus 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error Database");
    }
});

// 2. Submit Booking (Integrasi WhatsApp)
router.post('/booking/:id', async (req, res) => {
    try {
        const id_kamar = req.params.id;
        const { nama_penyewa, no_hp } = req.body;

        const sqlPenyewa = "INSERT INTO penyewa (nama_penyewa, no_hp) VALUES (?, ?)";
        await db.query(sqlPenyewa, [nama_penyewa, no_hp]);

        const nomorAdmin = "6281234567890"; // Ganti dengan nomor asli
        const pesan = `Halo Admin, saya ${nama_penyewa} ingin booking kamar ID ${id_kamar}.`;
        
        res.send(`
            <script>
                alert('Data tersimpan! Menghubungi pemilik via WhatsApp...');
                window.open('https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}', '_blank');
                window.location.href = '/';
            </script>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal proses booking");
    }
});

// 3. Proses Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [results] = await db.query('SELECT * FROM pemilik_kos WHERE username = ? AND password = ?', [username, password]);

        if (results.length > 0) {
            req.session.isLoggedIn = true;
            req.session.user = results[0];
            res.redirect('/dashboard');
        } else {
            res.send("<script>alert('Login Gagal'); window.location='/login';</script>");
        }
    } catch (err) {
        res.status(500).send("Error Server");
    }
});

// 4. Dashboard (Nested Query dengan Promise)
router.get('/dashboard', async (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');

    try {
        const [kamars] = await db.query('SELECT * FROM kamar');
        const [penyewas] = await db.query('SELECT * FROM penyewa');

        res.render('dashboard', { 
            kamars: kamars, 
            allPenyewa: penyewas, 
            user: req.session.user 
        });
    } catch (err) {
        res.status(500).send("Gagal memuat dashboard");
    }
});

// 5. Fitur Hapus
router.get('/delete-kamar/:id', async (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    try {
        await db.query('DELETE FROM kamar WHERE id_kamar = ?', [req.params.id]);
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send("Gagal menghapus");
    }
});

// 6. Fitur Edit (Handling NULL ID Penyewa)
router.post('/edit-kamar/:id', async (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    
    try {
        const { jenis_kamar, harga, deskripsi, status_kamar, id_penyewa } = req.body;
        const idKamar = req.params.id;
        const finalPenyewaId = (id_penyewa === "" || id_penyewa === "null") ? null : id_penyewa;

        const sql = 'UPDATE kamar SET jenis_kamar=?, harga=?, deskripsi=?, status_kamar=?, id_penyewa=? WHERE id_kamar=?';
        await db.query(sql, [jenis_kamar, harga, deskripsi, status_kamar, finalPenyewaId, idKamar]);
        
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal Update Database");
    }
});

// 7. Tambah Kamar
router.post('/add-kamar', async (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/login');
    try {
        const { jenis_kamar, harga, deskripsi, status_kamar } = req.body;
        const sql = 'INSERT INTO kamar (jenis_kamar, harga, deskripsi, status_kamar) VALUES (?, ?, ?, ?)';
        await db.query(sql, [jenis_kamar, harga, deskripsi, status_kamar]);
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send("Gagal Tambah Kamar");
    }
});

router.get('/login', (req, res) => res.render('login'));

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;