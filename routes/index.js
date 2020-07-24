var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var controller = require('../controller/user.controller') //import controller
//Import auth.middleware
var auth = require('../controller/auth.middleware');
//Get from ajax
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const axios = require('axios');
var md5 = require('md5');

//Fetch
const fetch = require('node-fetch');

//Daytime
var d = new Date();

//DB info
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  port: "3306",
  database: "iot"
});


// MQTT subscriber
var mqtt = require('mqtt');
const { log } = require('debug');
const { json } = require('express');
const e = require('express');
ip = 'mqtt://52.188.19.7:1883';
var client = mqtt.connect(ip);
//mqtt://13.76.250.158:1883
//mqtt://52.188.19.7:1883
//sv truong
//mqtt://52.187.125.59:1883
var mess;
//Sub sensor start
var topicSensor = 'Topic/TempHumi';

// async function getLimitTempt(daa){
//  var selectdblimit = `SELECT * FROM iot.LIMITTEMPT where id = (select Max(id) from iot.LIMITTEMPT);  `;
//  a = await con.query(selectdblimit);
// console.log(a.data);

// }

var limit;
const ex = async () => {

  limit = await axios.get('http://localhost:3000/apigioihannhietdo');


  return limit;
}

const fs = require('fs');
function readFile() {
  const obj = [];
  const data = fs.readFileSync('model', 'UTF-8');
  const lines = data.split(/\r?\n/);
  lines.forEach((line) => {
    obj.push(parseFloat(line));
  });
  return obj;
}

arg = readFile()
//Checklogin
var auth = require('../controller/auth.middleware');

//Nhận dữ liệu
client.on('message', (topicSensor, message) => {
  message = JSON.parse(message)[0];

  let tempt = message;

  async function a(message) {

    limit = await axios.get('http://localhost:3000/apigioihannhietdo');

    if (message.device_id == 'TempHumi ') {

      //them vao db
      var insert = `INSERT INTO CamBien (device,nhietdo,doam,thoigian) values ('${message.device_id}','${message.values[0]}','${message.values[1]}',now()) `;
      var run = con.query(insert);
      // console.log(message.values[1])
      if (message.values[0] > limit.data[0].gioihantren) {     //So sánh giới hạn
        //On motor
        // MQTT publisher
        var client = mqtt.connect(ip)
        var topic = 'Topic/Speaker'
        // var message = 'Hello tempt! 1'
        useAI = await axios.get('http://localhost:3000/useai');

        useAI = useAI.data[0].trangthai;

        // Kiểm tra trong db xem có sử dụng Ai ko
        if (useAI == false)
          cuongdo = limit.data[0].value;
        else {
          // cuongdo = message.values[0] * arg[0] + message.values[1] * arg[1] + arg[2]
          cuongdo = 99;
        }
        console.log(cuongdo);
        var message = [{ "device_id": "Speaker", "values": ["1", `"${cuongdo}"`] }]
        var mess = JSON.stringify(message);
        client.on('connect', () => {

          client.publish(topic, mess);
          console.log('Message on motor sent!',)


        })
        var insertGiatribomkhigioihannhietdomo = `insert into Motor(trangthai,value,thoigian,device,auto,idcambien) values(1,${cuongdo},now(),'Speaker','1',${limit.data[0].id} )`;
        var insertbangmotor = con.query(insertGiatribomkhigioihannhietdomo);
      } else if (message.values[0] < limit.data[0].gioihanduoi) {
        //OFF motor
        // MQTT publisher
        var client = mqtt.connect(ip)
        var topic = 'Topic/Speaker'
        // var message = 'Hello tempt! 1'
        var message = [{ "device_id": "Speaker", "values": ["0", "0"] }]
        var mess = JSON.stringify(message);
        client.on('connect', () => {

          client.publish(topic, mess);
          console.log('Message off motor sent!',)


        })
        var insertGiatribomkhigioihannhietdotat = `insert into Motor(trangthai,value,thoigian,device,auto,idcambien) values(0,0,now(),'Speaker','1',${limit.data[0].id} )`;
        console.log(insertGiatribomkhigioihannhietdotat);

        var insertbangmotor = con.query(insertGiatribomkhigioihannhietdotat);
      }




      // var selectdblimit = `SELECT * FROM iot.LIMITTEMPT where id = (select Max(id) from iot.Motor); `;

    }
  }
  a(tempt);

})

client.on('connect', () => {
  client.subscribe(topicSensor)
})
//Sub sensor End



//Sub motor start

var topicMotor = 'Topic/Speaker';

client.on('message', (topicMotor, message) => {

  // message = JSON.parse(message)[0];
  // if (message.device_id == 'Speaker') {

  //   //Ket noi
  //   var insert = `INSERT INTO Motor (device,trangthai,value,thoigian) values ('${message.device_id}','${message.values[0]}',${message.values[1]},now()) `

  //   con.query(insert, function (err, result, fields) {
  //     if (err) throw err;
  //   });
  // } else {

  // }
})

client.on('connect', () => {
  client.subscribe(topicMotor)
})

//Sub motor end


/* GET home page. */
router.get('/', function (req, res, next) {
  
  var info = req.cookies.info;
  if(!info){
    info = "" 
  }
    res.render('index', { title: 'Express',  data: info });
  
});
/* API data nhiet do. */
router.get('/apinhietdo', function (req, res, next) {
  // var select = `SELECT * FROM CamBien where idCamBien `;
  var select = `
 SELECT * FROM (
    SELECT * FROM iot.CamBien ORDER BY idCAmbien DESC LIMIT 30
 )Var1
    ORDER BY idCamBien ASC;`
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    res.send(result);

  });
});
/* API data gioi han nhiet do. */
router.get('/apigioihannhietdo', function (req, res, next) {
  // var select = `SELECT * FROM CamBien where idCamBien `;

  var select = `
  SELECT  Gioihannhietdo.id, Gioihannhietdo.gioihantren, Gioihannhietdo.gioihanduoi, Gioihannhietdo.timecreate, Gioihannhietdo.username,giatribomkhigioihannhietdo.value   FROM iot.Gioihannhietdo inner join giatribomkhigioihannhietdo  on Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo) and giatribomkhigioihannhietdo.idgioihannhietdo = Gioihannhietdo.id ;`
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    if (result[0]) {
      res.send(result)
    } else {
      var select = `
      SELECT  *   FROM iot.Gioihannhietdo where Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo)  ;`
      con.query(select, function (err, result, fields) {
        if (err) throw err; res.send(result)
        // console.log(result)
      })
    }

  });
});

//Bieu do
router.get('/detrong', function (req, res, next) {

  var select = `SELECT * FROM CamBien `;
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    var nhietdo = [];
    var label = [];
    var doam = [];

    result.forEach(element => {
      nhietdo.push(element.nhietdo);
      doam.push(element.doam);

      label.push(`'${element.thoigian.slice(15, 24)}'`);

    });


    res.render('bieudonhietdo', { title: 'Express', label: label, nhietdo: nhietdo, doam: doam });

  });
});
/* GET Trang thai motor. */
router.use('/bieudonhietdo',auth.authen, function (req, res, next) {
  var usr = req.cookies.info.username;
  status = "";
  var obj = {
    "gioihantren": "chuaxacdinh",
    "gioihanduoi": "chuaxacdinh"
  }
  var data;
  //lay gioi han nhiet do
  var selectdblimit = `SELECT * FROM iot.Gioihannhietdo where id = (select max(id) from iot.Gioihannhietdo where gioihantren != 999 and gioihanduoi != 999); `;
  con.query(selectdblimit, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {

      obj.gioihantren = result[0].gioihantren;
      obj.gioihanduoi = result[0].gioihanduoi;


      var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
      con.query(select, function (err, result, data) {
        if (err) {
          console.log(err);
        } else {

          data = result[0];

          res.render('bieudonhietdo', { title: 'Express', data: data, obj: obj, status: status, username: usr });

        }
      })
    }

  });
});


/* API data motor . */
router.get('/apimotor', function (req, res, next) {
  var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    res.send(result);

  });
});
/* Tắt motor*/
router.use('/tatbom',auth.authen, function (req, res, next) {
  var username = req.cookies.info.username;
  // MQTT publisher
  var client = mqtt.connect(ip)
  var topic = 'Topic/Speaker'
  // var message = 'Hello tempt! 1'
  var message = [{ "device_id": "Speaker", "values": ["0", "0"] }]
  var mess = JSON.stringify(message);
  client.on('connect', () => {

    client.publish(topic, mess);
    console.log('Message on motor sent!',)

    var sql = `insert into Gioihannhietdo(gioihantren,gioihanduoi,timecreate,username) values(999,-999,now(),'${username}')`;
    con.query(sql, function (err, result, fields) {
      if (err) console.log(err);
      else {
        var sql = `insert into Motor(trangthai,value,thoigian,device,auto,username) values(0,0,now(),'Speaker',0,'${username}')`;
        con.query(sql, function (err, result, fields) {
          if (err) console.log(err);
          else {
            res.send('success');

          }
        }
        )
      }

    });

  })

  //1883

});
/* Mở motor*/
router.use('/batbom',auth.authen, function (req, res, next) {

  var cuongdo = Number.parseInt(req.body.cuongdo);
  if (cuongdo != 0) {
    var username = req.cookies.info.username;
    // MQTT publisher
    var client = mqtt.connect(ip)
    var topic = 'Topic/Speaker'
    // var message = 'Hello tempt! 1'
    var message = [{ "device_id": "Speaker", "values": ["1", `"${cuongdo}"`] }]
    var mess = JSON.stringify(message);
    client.on('connect', () => {

      client.publish(topic, mess);
      console.log('Message on motor sent!',)

      var sql = `insert into Gioihannhietdo(gioihantren,gioihanduoi,timecreate,username) values(999,-999,now(),'${username}')`;
      con.query(sql, function (err, result, fields) {
        if (err) throw err;
        else {
          var sql = `insert into Motor(trangthai,value,thoigian,device,auto,username) values(1,${cuongdo},now(),'Speaker',0,'${username}')`;
          con.query(sql, function (err, result, fields) {
            if (err) throw err;
            else {
              res.send('success');

            }
          }
          )
        }

      });

    })
  } else {
    res.send('cuongdosai');
  }


  //1883

});

/* POSt giá trị giới hạn hiện tại*/
router.use('/getlimit',auth.authen, async function (req, res, next) {
  var up = req.body.up;
  var down = req.body.down;
  var cuongdo = req.body.cuongdo;
  var status;
  var username = req.cookies.info.username;
  var data = [];
  var useAI = await axios.get('http://localhost:3000/useai');
  useAI = useAI.data[0].trangthai;
  if (up - 2 >= down) {

    //lay gioi han nhiet do

    var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
    con.query(select, function (err, result) {

      if (err) {
        console.log(err);
      } else {
        data = result[0];

        var select = `insert into iot.Gioihannhietdo (gioihantren, gioihanduoi, timecreate, username) values(${up},${down},now(),'${username}')`;
        con.query(select, function (err, result) {
          if (err) {
            console.log(err);
          } else {

            var select = `insert into iot.Giatribomkhigioihannhietdo (value, idgioihannhietdo) values(${cuongdo},${result.insertId})`;
            con.query(select, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                if(useAI == 0 ){
                  status = 'success';

                } else {
                  status = 'aion';

                }
                return res.send(status);

              }
            })
          }
        })
      }
    })

  } else {
    var obj = {
      "gioihantren": "chuaxacdinh",
      "gioihanduoi": "chuaxacdinh"
    }
    var data;
    //lay gioi han nhiet do
    var selectdblimit = `SELECT * FROM iot.Gioihannhietdo where id = (select Max(id) from iot.Motor); `;
    con.query(selectdblimit, function (err, result, obj) {
      if (err) {
        console.log(err)
      } else {

        obj.gioihantren = result[0].gioihantren;
        obj.gioihanduoi = result[0].gioihanduoi;


        var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
        con.query(select, function (err, result, data) {
          if (err) {
            console.log(err);
          } else {

            data = result[0];

            status = 'wrongnumber';

            return res.send(status);

          }
        })
      }

    });

  }


})
/* Lấy giới hạn hiện tại. */
router.use('/checkgiohanstatus',auth.authen, async function name(req, res, next) {
  var useAI = await axios.get('http://localhost:3000/useai');
  useAI = useAI.data[0].trangthai;

 
    var selectdblimit = ` SELECT * FROM iot.Gioihannhietdo where Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo) ; `;
  con.query(selectdblimit, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      if ((result[0].gioihantren == 999) && (result[0].gioihanduoi == -999)) {
        var selectdblimit = ` SELECT  Gioihannhietdo.id, Gioihannhietdo.gioihantren, Gioihannhietdo.gioihanduoi, Gioihannhietdo.timecreate, Gioihannhietdo.username,giatribomkhigioihannhietdo.value   FROM iot.Gioihannhietdo inner join giatribomkhigioihannhietdo  on Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo where  gioihantren != 999 and gioihanduoi != 999) and giatribomkhigioihannhietdo.idgioihannhietdo = Gioihannhietdo.id ; `;
        con.query(selectdblimit, function (err, result, obj) {
          if (err) {
            console.log(err)
          } else {
            var ketqua = result;

            ketqua.push('khonghieuluc');

            res.send(ketqua)

          }
        })
      } else {
        var selectdblimit = `SELECT  Gioihannhietdo.id, Gioihannhietdo.gioihantren, Gioihannhietdo.gioihanduoi, Gioihannhietdo.timecreate, Gioihannhietdo.username,giatribomkhigioihannhietdo.value   FROM iot.Gioihannhietdo inner join giatribomkhigioihannhietdo  on Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo) and giatribomkhigioihannhietdo.idgioihannhietdo = Gioihannhietdo.id ; `;
        con.query(selectdblimit, function (err, result, obj) {
          if (err) {
            console.log(err)
          } else {
            var ketqua = result;
            if (useAI == 0) {
              ketqua.push('cohieuluc');

            } else {
              ketqua.push('khonghieuluc');

            }

            res.send(ketqua)

          }
        })

      }
    }
  })
});
/* Lấy giới hạn hiện tại. */
router.use('/hienthibieudo',auth.authen, function name(req, res, next) {
  var selectdblimit = ` SELECT * FROM iot.Gioihannhietdo where Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo) ; `;
  con.query(selectdblimit, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      if ((result[0].gioihantren == 999) && (result[0].gioihanduoi == -999)) {
        var selectdblimit = ` SELECT  Gioihannhietdo.id, Gioihannhietdo.gioihantren, Gioihannhietdo.gioihanduoi, Gioihannhietdo.timecreate, Gioihannhietdo.username,giatribomkhigioihannhietdo.value   FROM iot.Gioihannhietdo inner join giatribomkhigioihannhietdo  on Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo where  gioihantren != 999 and gioihanduoi != 999) and giatribomkhigioihannhietdo.idgioihannhietdo = Gioihannhietdo.id ; `;
        con.query(selectdblimit, function (err, result, obj) {
          if (err) {
            console.log(err)
          } else {
            var ketqua = result;

            ketqua.push('khonghieuluc');

            res.send(ketqua)

          }
        })
      } else {
        var selectdblimit = `SELECT  Gioihannhietdo.id, Gioihannhietdo.gioihantren, Gioihannhietdo.gioihanduoi, Gioihannhietdo.timecreate, Gioihannhietdo.username,giatribomkhigioihannhietdo.value   FROM iot.Gioihannhietdo inner join giatribomkhigioihannhietdo  on Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo) and giatribomkhigioihannhietdo.idgioihannhietdo = Gioihannhietdo.id ; `;
        con.query(selectdblimit, function (err, result, obj) {
          if (err) {
            console.log(err)
          } else {
            var ketqua = result;

            ketqua.push('cohieuluc');

            res.send(ketqua)

          }
        })

      }
    }
  })
});
/* Lấy giới hạn hiện tại. */
router.use('/laydulieuthongke',auth.authen, function name(req, res, next) {
  var data = req.body.data;
  console.log(data);
  if (data.length == 10) {
    var selectdblimit = ` SELECT * FROM iot.CamBien where  thoigian like '${data}%' `;

    con.query(selectdblimit, function (err, result, obj) {
      if (err) {
        console.log(err)
      } else {
        res.send(result);
      }
    })
  } else if (data.length == 7) {
    var selectdblimit = ` SELECT * FROM iot.CamBien where  thoigian like '%${data}%' `;

    con.query(selectdblimit, function (err, result, obj) {
      if (err) {
        console.log(err)
      } else {
        res.send(result);
      }
    })
  } else if (data.length == 4) {
    var selectdblimit = ` SELECT * FROM iot.CamBien where  thoigian like '%${data}%' `;

    con.query(selectdblimit, function (err, result, obj) {
      if (err) {
        console.log(err)
      } else {
        res.send(result);
      }
    })
  }
})
/* Lấy trạng thái ai hiện tại */
router.use('/useai', function (req, res, next) {
  var sql = 'select * from iot.sudungai where id = (select max(id) from iot.sudungai)';
  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.send(result);
    }
  })
})
/* Lấy giới hạn hiện tại. */
router.use('/setai',auth.authen, function (req, res, next) {
  var status = req.body.status;
  var username = req.cookies.info.username;
  var sql = `insert into  iot.sudungai (username, trangthai, daytime) values ('${username}', ${status}, now())`;
  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.send(status);

    }
  })
})

/* GET Dang ki page. */
router.get('/thongke',auth.authen, function (req, res, next) {
  var usr = req.cookies.info.username;

  res.render('thongke', {username: usr});
});
/* GET Lịch sử dùng bơm. */
router.get('/lichsudungbom',auth.authen, function (req, res, next) {
  var sql = `SELECT * FROM (SELECT * FROM iot.motor ORDER BY idMotor DESC LIMIT 10) sub ORDER BY idMotor ASC
  `;
  var usr = req.cookies.info.username;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.render('lichsudungbom', {data:result,username: usr});

    }
  })
});
/* GET Quan ly nhan vien page. */
router.get('/quanlynhanvien',auth.authen, function (req, res, next) {
  var sql = `select * from user`;
  var usr = req.cookies.info.username;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.render('quanlynhanvien', {data:result,username: usr});

    }
  })
});
/* GET Sua vien page. */
router.post('/suanhanvien',auth.authen, function (req, res, next) {
  var usr = req.cookies.info.username;
  var username = req.body.username;
  var sql = `select * from user where username = '${username}'`;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.render('suanhanvien', {data:result,username: usr});

    }
  })
});
//Qua trang sửa nhân viên
router.post('/suanhanvien',auth.authen, function (req, res, next) {
  var usr = req.cookies.info.username;
  var username = req.body.username;
  var sql = `select * from user where username = '${username}'`;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.render('suanhanvien', {data:result,username: usr});

    }
  })
});
//Xác nhận sửa nhân viên
router.post('/xacnhansuanhvien',auth.authen, function (req, res, next) {
  var usr = req.cookies.info.username;
  var username = req.body.username;
  var phone = req.body.phone;
  var role = req.body.role;
console.log(username);

  var sql = `update user set role = '${role}', phone = '${phone}'  where username = '${username}'`;
console.log(sql);
  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('quanlynhanvien')

    }
  })
});
//Qua trang đỏi mật khẩu nhân viên
router.post('/doimatkhau',auth.authen, function (req, res, next) {
  var usr = req.cookies.info.username;
  var username = req.body.username;
  var password = req.body.password;

  var sql = `select * from user where username = '${username}'`;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.render('doimatkhaunhanvien', {data:result,username: usr});

    }
  })
});
//Xác nhận đổi mật khẩu nhân viên
router.post('/xacnhandoimatkhau',auth.authen, function (req, res, next) {
  var usr = req.cookies.info.username;
  var username = req.body.username;
  var password = md5(req.body.password);

  var sql = `update user set  password = '${password}'  where username = '${username}'`;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {

      res.redirect('quanlynhanvien')

    }
  })
});
//Qua trang đỏi mật khẩu user
router.get('/doimatkhauuser',auth.authen, function (req, res, next) {
  var username = req.cookies.info.username;

  var sql = `select * from user where username = '${username}'`;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      res.render('doimatkhaunhanvienuser', {data:result,username: username});

    }
  })
});
//Xác nhận đổi mật khẩu user
router.post('/xacnhandoimatkhauuser',auth.authen, function (req, res, next) {
  var username = req.cookies.info.username;
  var password = md5(req.body.password);

  var sql = `update user set  password = '${password}'  where username = '${username}'`;

  con.query(sql, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {

      res.redirect('doimatkhauuser')

    }
  })
});
/* GET Dang ki page. */
router.get('/dangki',auth.authen ,controller.dangki);
/* POST home page. */
router.post('/dangki', controller.xacthucdangki);
//Login
router.get('/dangnhap', controller.dangnhap);
//Xac thuc dang nhap
router.post('/xacthucdangnhap', auth.xacthucdangnhap);
router.use('/dangxuat',  function (req, res, next) {
 
    //    res.cookie('info',{'username':usr, 'password':pass});

    res.cookie('info', { expires: Date.now() });
    res.redirect('/');

});
module.exports = router;
