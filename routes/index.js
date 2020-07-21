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


client.on('message', (topicSensor, message) => {
  message = JSON.parse(message)[0];

  let tempt = message;

  async function a(message) {

    limit = await axios.get('http://localhost:3000/apigioihannhietdo');




    if (message.device_id == 'TempHumi ') {

      //them vao db
      var insert = `INSERT INTO CamBien (device,nhietdo,doam,thoigian) values ('${message.device_id}','${message.values[0]}','${message.values[1]}',now()) `;
      var run = con.query(insert);
      if (message.values[0] > limit.data[0].gioihantren) {
        //On motor
        // MQTT publisher
        var client = mqtt.connect(ip)
        var topic = 'Topic/Speaker'
        // var message = 'Hello tempt! 1'



        cuongdo = limit.data[0].value;
        var message = [{ "device_id": "Speaker", "values": ["1", `"${cuongdo}"`] }]
        var mess = JSON.stringify(message);
        client.on('connect', () => {

          client.publish(topic, mess);
          console.log('Message on motor sent!',)


        })
        var insertGiatribomkhigioihannhietdomo = `insert into Motor(trangthai,value,thoigian,device,auto,idcambien) values(1,${cuongdo},now(),'Speaker','1',${limit.data[0].id} )`;
        console.log(insertGiatribomkhigioihannhietdomo);
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
  var select = `SELECT * FROM CamBien `;
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    var data = [];
    var label = [];
    result.forEach(element => {
      data.push(element.nhietdo);
      label.push(`'${element.device}'`);
    });
    res.render('index', { title: 'Express', label: label, data: data });
  });
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
    if(result[0]){
      res.send(result)
    } else {
      var select = `
      SELECT  *   FROM iot.Gioihannhietdo where Gioihannhietdo.id = (select max(id) from iot.Gioihannhietdo)  ;`
      con.query(select, function (err, result, fields) {
        if (err) throw err; res.send(result)
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
router.use('/bieudonhietdo', function (req, res, next) {
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

          res.render('bieudonhietdo', { title: 'Express', data: data, obj: obj, status: status });

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
router.use('/tatbom', function (req, res, next) {
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
router.use('/batbom', function (req, res, next) {

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
router.use('/getlimit', function (req, res, next) {
  var up = req.body.up;
  var down = req.body.down;
  var cuongdo = req.body.cuongdo;

  var status;
  var username = req.cookies.info.username;
  var data = [];
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
                status = 'success';
                res.send(status);

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

            res.send(status);

          }
        })
      }

    });

  }


})
/* Lấy giới hạn hiện tại. */
router.use('/checkgiohanstatus', function name(req, res, next) {
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
router.use('/hienthibieudo', function name(req, res, next) {
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
router.use('/laydulieuthongke', function name(req, res, next) {
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
/* GET Dang ki page. */
router.get('/thongke',function(req,res,next){
  res.render('thongke');
});
/* GET Dang ki page. */
router.get('/dangki', controller.dangki);
/* POST home page. */
router.post('/dangki', controller.xacthucdangki);
//Login
router.get('/dangnhap', controller.dangnhap);
//Xac thuc dang nhap
router.post('/xacthucdangnhap', auth.xacthucdangnhap);
module.exports = router;
