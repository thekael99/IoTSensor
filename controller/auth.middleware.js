
var md5 = require('md5');
var mysql = require('mysql');
const { log } = require('debug');
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "admin123",
    port: "3306",
    database: "iot"
});
//Get date
var d  = new Date();


//Post xacthucdangnhap
module.exports.xacthucdangnhap = function (req, res, next) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
 var sql= `SELECT * FROM user where username = '${usr}' `;
 
con.query(sql, function (err, result, kq) {
    if (err) {
        console.log(err);
        return res.render('dangnhap', { title: 'Express', status: 'Co loi khi dang nhap' });
    }  else {
            if(result[0].password == pass){
                res.cookie('info', { 'username': usr, 'password': pass, 'role': result[0].role });

             //   return res.render('dangnhap', { title: 'Express', status: 'ok' });
                res.redirect('/');
            } else{
                return res.render('dangnhap', { title: 'Express', status: 'Sai username hoac password' });

            }
        

    }
    

})

    
}

//Function xac thuc dang nhap
module.exports.authen = function (req, res, next) {
    var info = req.cookies.info;


    if (!info) {
        //res.render('dangnhap', { title: 'Express', status: '' });
        
        res.redirect("/dangnhap");
    } else if (info.username) {
        var username = info.username
        var password = info.password;
        
        var sql= `SELECT * FROM user where username = '${username}' `;
        con.query(sql, function (err, result, kq) {
            if (username == result[0].username && password == result[0].password) {
                next();
    
            }
            else {
    
                res.redirect("/dangnhap")
            }

        })

       
    } 
    else { res.redirect("/dangnhap") }
}
