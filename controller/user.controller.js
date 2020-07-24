
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

//Get date
var d  = new Date();


module.exports.dangki = function (req, res) {
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";
        }
    }
    else {
        name = "";

    }
    res.render('dangki', { title: 'Express', status: '', username: name, role: "" });
}

module.exports.xacthucdangki = function (req, res) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
    var phone = req.body.phone;
    var role = req.body.role;
  var ngaydk = d;
  var username = req.cookies.info.username
    var sql = `INSERT INTO user (username, password,phone,role,ngaydk) VALUES ('${usr}','${pass}','${phone}','${role}','${ngaydk}')`;
    con.query(sql, function (err, result, kq) {
        if (err != 1062 ) {
            console.log(err.errno);
            return res.render('dangki', { title: 'Express', status: 'Co loi khi dang ki' , username:username});


        } else if(err.errno == 1062){
            return res.render('dangki', { title: 'Express', status: 'Tai khoan da duoc dang ki' ,username:username});

        } 
        else {
            return res.render('dangki', { title: 'Express', status: 'Dang ki thanh cong',username:username });

        }

    })



}




// res.render('dangki', { title: 'Express', status: 'Tai khoan da duoc dang ki' });





module.exports.dangnhap = function (req, res, next) {
    var name, role;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;


        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    res.render('dangnhap', { title: 'Express', status: '', name: name, role: "" });
}