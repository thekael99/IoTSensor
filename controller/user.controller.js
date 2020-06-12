
var md5 = require('md5');
const { log } = require('debug');

//End of Import lowDB
//Date time
var d = new Date();
var mysql = require('mysql');
const { connect } = require('../routes');
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "admin123",
    port: "3306",
    database: "iot"
});




module.exports.dangki = function (req, res) {
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
            giohang = db.get('MatHang').find({ username: name }).value();
        } else {
            name = "";
        }
    }
    else {
        name = "";

    }
    res.render('dangki', { title: 'Express', status: '', name: name, role: "" });
}

module.exports.xacthucdangki = function (req, res) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
    var phone = req.body.phone;
    var role = req.body.role;
    //Ket noi
    var kq;
    // if (err) throw err;
    var sql1 = `SELECT * FROM user where username = '${usr}' `;

    // con.query(sql1, function (err, result) {
    //     if (err) throw err;
    //     //  console.log(result[0]);

    //     kq = result[0].username;
    //     //     kq = result;

    //     if (result[0].username == usr) {
    //         return res.render('dangki', { title: 'Express', status: 'Tai khoan da duoc dang ki' });

    //     } else {
    //         var sql2 = `INSERT INTO user (username, password, role, phone) VALUES ('${usr}','${pass}','${role}','${phone}')`;
    //         con.query(sql2, function (err, result) {
    //             if (err) throw err;
    //         });
    //     }
    //     return res.render('dangnhap', { title: 'Express', status: 'Dang ki thanh cong', });

    // });




    // res.render('dangki', { title: 'Express', status: 'Tai khoan da duoc dang ki' });




}
module.exports.dangnhap = function (req, res, next) {
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    res.render('dangnhap', { title: 'Express', status: '', name: name, role: "" });
}