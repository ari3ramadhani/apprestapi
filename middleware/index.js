var express = require('express');
var auth = require('./auth');
var router = express.Router();
var verifikasi = require('./verifikasi');
//daftarkan menu registrasi
router.post('/api/v1/register', auth.registrasi);
router.post('/api/v1/login', auth.login);

router.get('/api/v1/rahasia', verifikasi(),auth.halamanrahasia);
//alamt yang perlu otorisasi
//halaman ini menampilkan data tabel oleh administrator
router.get('/api/v1/admin/mahasiswa', verifikasi(1),auth.adminmahasiswa);
router.get('/verify',auth.verifikasi);

module.exports = router;

