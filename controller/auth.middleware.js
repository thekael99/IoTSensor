
var md5 = require('md5');
var mysql = require('mysql');
const { log } = require('debug');
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
 var sql= `SELECT * FROM user where username = '${usr}' `;
//var sql = `INSERT INTO user (username, password,phone,role) VALUES ('${usr}','${pass}','${phone}','${role}')`;
con.query(sql, function (err, result, kq) {
    if (err) {
        console.log(err);
        return res.render('dangnhap', { title: 'Express', status: 'Co loi khi dang ki' });
    }  
    console.log(result);
    

})

    
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
