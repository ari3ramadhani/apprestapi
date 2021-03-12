var connection = require('../koneksi');
var mysql = require('mysql');
var md5 = require('MD5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');
var ip = require('ip');
var nodemailer = require('nodemailer');

let smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "arivideo34@gmail.com",
        pass: "SekolaH144"
    }
})

var rand, mailOptions, host, link

exports.verifikasi = function (req, res) {
    console.log(req.protocol)
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        if (req.query.id == rand) {
            connection.query('UPDATE user SET isVerified=? WHERE email=?', [1, mailOptions.to],
                function (error, rows, fields) {
                    if (error) {
                        console.log(error)
                        res.end(error)
                    } else {
                        res.end("<h1> Email Anda " + mailOptions.to + " telah terverifikasi</h1>")
                    }
                })
        } else {
            res.end("<h1> Email Anda " + mailOptions.to + " tidak terverifikasi</h1>")
        }
    }
}


// controller untuk register
exports.registrasi = function (req, res) {
    var post = {
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password),
        role: 3,
        tanggal_daftar: new Date(),
        isVerified: 0
    }

    var query = "SELECT email FROM ?? WHERE ??=?";
    var table = ["user", "email", post.email];

    query = mysql.format(query, table);

    connection.query(query, function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            if (rows.length == 0) {
                var query = "INSERT INTO ?? SET ?";
                var table = ["user"];
                query = mysql.format(query, table);
                connection.query(query, post, function (error, rows) {
                    if (error) {
                        console.log(error);
                    } else {

                        //kiri email verifikasi
                        rand = Math.floor((Math.random() * 100) + 54)
                        host = "localhost:3001"
                        link = "http://" + host + "/auth/verify?id=" + rand
                        mailOptions = {
                            to: post.email,
                            subject: "Silahkan konfirmasi email anda",
                            html: "<center><img src='https://www.pngfind.com/pngs/m/685-6854970_react-logo-png-png-download-logo-png-reactjs.png' alt='react js' width='500' height='600'></center> <br>Hallo, <br>Please klik tautan verifikasi berikut <br>" +
                                "<a href=" + link + ">Clik here to verifikasi</a>"
                        }
                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                res.json({
                                    success: false,
                                    isRegistered: false,
                                    message: "Email verfikasi gagal terkirim"
                                }).end();
                                // Gunakan end agar tidak melakukan looping

                            } else {
                                res.json({
                                    success: true,
                                    isRegistered: false,
                                    message: "Email verfikasi berhasil terkirim"
                                }).end();
                            }
                        });

                        // response.ok("Berhasil menambah userbaru!", res);
                    }
                });
            } else {
                res.json({
                    success: false,
                    isRegistered: false,
                    message: "Email sudah terdaftar"
                }).end();
            }
        }
    });
}

//controller untuk login

exports.login = function (req, res) {
    var post = {
        password: req.body.password,
        email: req.body.email
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["user", "password", md5(post.password), "email", post.email];

    query = mysql.format(query, table);
    connection.query(query, function (error, rows) {

        if (error) {
            console.log(error);
        } else {
            if (rows.length == 1) {
                var token = jwt.sign({ rows }, config.secret, {
                    expiresIn: 500000
                });
                id_user = rows[0].id;
                // tambah row username
                username = rows[0].username
                // tambah row role
                role = rows[0].role
                // 3 variable expired
                var expired = 10000

                var isVerified = rows[0].isVerified

                var data = {
                    id_user: id_user,
                    access_token: token,
                    ip_address: ip.address()
                }

                var query = "INSERT INTO ?? SET ?";
                var table = ["akses_token"];

                query = mysql.format(query, table);
                connection.query(query, data, function (error, rows) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({
                            success: true,
                            message: 'TOken JWT tergenerate',
                            token: token,
                            expires: expired,
                            currUser: data.id_user,
                            //2 tambahkan user
                            user: username,
                            role: role,
                            isVerified: isVerified
                        })
                    }
                });
            } else {
                res.json({ "Error": true, "Message": "Email atau password salah" });
            }
        }
    })
}
exports.halamanrahasia = function (req, res) {
    response.ok("Halaman ini hanya untuk user role 2", res)
}

//menampilkan semua data mahasiswa
exports.adminmahasiswa = function (req, res) {
    connection.query("Select * FROM mahasiswa", function (error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res)
        }
    })
}