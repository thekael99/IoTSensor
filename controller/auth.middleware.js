
var md5 = require('md5');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "thien",
    user: "root",
    password: "",
    database: "iot"
  });


//   //Ket noi
//   con.connect(function(err) {
//     if (err) throw err;
//     con.query("SELECT * FROM user", function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//     });
//   });
module.exports.xacthucdangnhap = function (req, res, next) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);


    var find = db.get('User').find({ username: usr }).value();
    if (!find) {
        res.render('dangnhap', { title: 'Express', status: 'Tai khoan chua duoc dang ki' });
    } else {
        if (usr == find.username && pass == find.password) {
            res.cookie('info', { 'username': usr, 'password': pass, 'role': find.role });
            res.redirect('/');
        }
        else {
            res.render('dangnhap', { title: 'Express', status: 'Dang nhap that bai' });

        }
    }
}

module.exports.authen = function (req, res, next) {
    var info = req.cookies.info;


    if (!info) {
        //res.render('dangnhap', { title: 'Express', status: '' });
        
        res.redirect("/dangnhap");
    } else if (info.username) {
        var username = info.username
        var password = info.password;
        console.log("USR la "+username + " pas la "+ password);
        
        var find = db.get('User').find({ username: username }).value();

        if (username == find.username && password == find.password) {
            next();

        }
        else {

            res.redirect("/dangnhap")
        }
    } 
    else { res.redirect("/dangnhap") }
}
