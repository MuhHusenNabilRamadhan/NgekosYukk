const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config(); // WAJIB: Agar bisa membaca file .env

const app = express();
const routes = require('./routes/index');

// 1. Pengaturan View Engine
app.set('view engine', 'ejs');
// Pastikan nama folder kamu 'view' (sesuai kode) atau 'views' (standar EJS)
app.set('views', path.join(__dirname, 'view')); 

// 2. Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 3. Konfigurasi Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasia-ngekos-super-aman',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Sesi berlaku 24 jam
}));

// 4. Gunakan Routes
app.use('/', routes);

// 5. Port Dinamis (Mengikuti Docker/Environment)
// Di Dockerfile kita EXPOSE 3000, jadi internal port tetap 3000
const PORT = 3000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server App_Service berjalan internal di port ${PORT}`);
    console.log(`Akses publik via Nginx di port: ${process.env.APP_PORT || 'Default'}`);
});