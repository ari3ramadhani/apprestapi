'use strict';

var response = require('./res');
var connection = require('./koneksi');

exports.index = function (req, res) {
    response.ok("Aplikasi REST API sudah berjalan", res)
}

//menampilkan data mahasiswa
exports.tampilsemuamahasiswa = function (req, res) {
    connection.query('SELECT * FROM mahasiswa', function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res)
        }
    });
};

//menampilkan semua data berdasarkan id
exports.tampilberdasarkanid = function (req, res) {
    let id = req.params.id;
    connection.query('Select * From mahasiswa where id_mahasiswa=?', [id],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res)
            }
        });
}
//menambah data mahasiswa
exports.tambahMahasiswa = function (req, res) {
    var nim = req.body.nim;
    var nama = req.body.nama;
    var jurusan = req.body.jurusan;

    connection.query('INSERT INTO mahasiswa (nim,nama,jurusan)Values(?,?,?)',
        [nim, nama, jurusan],
        function (error, rows , fields){
            if (error) {
                console.log(error);
            } else {
                response.ok("Berhasil menambah data", res)
            }
        });
};

//ubah berdasarkan id
exports.ubahMahasiswa = function(req,res){
    var id = req.params.id_mahasiswa;
    var nim = req.body.nim;
    var nama = req.body.nama;
    var jurusan = req.body.jurusan;

    connection.query('UPDATE mahasiswa set nim=?, nama=?, jurusan=? WHERE  id_mahasiswa=?',[nim,nama,jurusan,id],
    function(error,rows,fields){
        if(error){
            console.log(error);
        }else{
            response.ok("Berhasil ubah data", res)
        }
    });
};
