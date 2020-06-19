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

//Fetch
const fetch = require('node-fetch');

//Daytime
var d = new Date();

//DB info
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin123",
  port: "3306",
  database: "iot"
});


// MQTT subscriber
var mqtt = require('mqtt');
const { log } = require('debug');
const { json } = require('express');
ip = 'mqtt://52.188.19.7:1883';
var client = mqtt.connect(ip)
//mqtt://13.76.250.158:1883
//mqtt://52.188.19.7:1883
var mess;
//Sub sensor start
var topicSensor = 'Topic/TempHumi';

client.on('message', (topicSensor, message) => {
  //  message = message.toString();
  message = JSON.parse(message)[0];

  if (message.device_id == 'TempHumi ') {

    if (message.values[0] > 30) {

     
      console.log(message.values[0]);

      //insert nhiet do

      var insert = `INSERT INTO CamBien (device,nhietdo,doam,thoigian) values ('${message.device_id}','${message.values[0]}','${message.values[1]}','${d}') `;

      con.query(insert, function (err, result, fields) {
        if (err) { throw err } else {
 //  On motor
      // MQTT publisher
      var client = mqtt.connect(ip)
      var topic = 'Topic/Speaker'
      // var message = 'Hello tempt! 1'
      var message = [{ "device_id": "Speaker", "values": ["1", "80"] }]
      var mess = JSON.stringify(message);
      client.on('connect', () => {
        console.log('Message on motor sent!',)

        client.publish(topic, mess);
      })
        }
      })
    } else if (message.values[0] < 20) {
     

      //insert nhiet do

      var insert = `INSERT INTO CamBien (device,nhietdo,doam,thoigian) values ('${message.device_id}','${message.values[0]}','${message.values[1]}','${d}') `;

      con.query(insert, function (err, result, fields) {
        if (err) { throw err } else {
           //  Off motor
      // MQTT publisher
      var client = mqtt.connect(ip)
      var topic = 'Topic/Speaker'
      // var message = 'Hello tempt! 1'
      var message = [{ "device_id": "Speaker", "values": ["0", "80"] }]
      var mess = JSON.stringify(message);
      client.on('connect', () => {
        console.log('Message off motor sent!',)

        client.publish(topic, mess);
      })
        }
      })
    } else {
      //insert nhiet do

      var insert = `INSERT INTO CamBien (device,nhietdo,doam,thoigian) values ('${message.device_id}','${message.values[0]}','${message.values[1]}','${d}') `;
console.log('ko lam gi ca');

      con.query(insert, function (err, result, fields) {
        if (err) { throw err }
      })
    }


    // mess = message;
    // var selectdblimit = `SELECT * FROM iot.LIMITTEMPT where id = (select Max(id) from iot.Motor); `;
    // con.query(selectdblimit, function (err, result, obj) {
    //   if (err) {
    //     console.log(err)
    //   } else {

    //     if (30 >= result.gioihantren) {

    //       //Mo motor
    //       // MQTT publisher
    //       var client = mqtt.connect(ip)
    //       var topic = 'Topic/Speaker'
    //       // var message = 'Hello tempt! 1'
    //       var message = [{ "device_id": "Speaker", "values": ["1", "80"] }]
    //       var mess = JSON.stringify(message);
    //       client.on('connect', () => {

    //         client.publish(topic, mess);
    //         //Luu khoi dong motor

    //       })

    //     } else if (20 <= result.giohanduoi) {

    //        //Dong motor
    //       // MQTT publisher
    //       var client = mqtt.connect(ip)
    //       var topic = 'Topic/Speaker'
    //       // var message = 'Hello tempt! 1'
    //       var message = [{ "device_id": "Speaker", "values": ["0", "80"] }]
    //       var mess = JSON.stringify(message);
    //       client.on('connect', () => {

    //         client.publish(topic, mess);
    //         //Luu khoi dong motor

    //       })
    //     } else {



    //     }

    //   }
    // })


  }



})

client.on('connect', () => {
  client.subscribe(topicSensor)
})
//Sub sensor End
//Sub motor start

var topicMotor = 'Topic/Speaker';

client.on('message', (topicMotor, message) => {

  message = JSON.parse(message)[0];

  if (message.device_id == 'Speaker') {

    //Ket noi
    var insert = `INSERT INTO Motor (device,trangthai,value,thoigian) values ('${message.device_id}','${message.values[0]}','${message.values[1]}','${d}') `

    con.query(insert, function (err, result, fields) {
      if (err) throw err;
    });
  }
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
    SELECT * FROM iot.CamBien ORDER BY idCAmbien DESC LIMIT 10
 )Var1
    ORDER BY idCamBien ASC;`
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    res.send(result);

  });
});
//Bieu do
router.get('/bieudonhietdo', function (req, res, next) {

  var select = `SELECT * FROM CamBien `;
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    var data = [];
    var label = [];

    result.forEach(element => {
      data.push(element.nhietdo);
      label.push(`'${element.device}'`);

    });


    res.render('bieudonhietdo', { title: 'Express', label: label, data: data });

  });
});
/* GET Trang thai motor. */
router.get('/trangthaimotor', function (req, res, next) {
  status = "";
  var obj = {
    "gioihantren": "chuaxacdinh",
    "gioihanduoi": "chuaxacdinh"
  }
  var data;
  //lay gioi han nhiet do
  var selectdblimit = `SELECT * FROM iot.LIMITTEMPT where id = (select Max(id) from iot.Motor); `;
  con.query(selectdblimit, function (err, result, obj) {
    if (err) {
      console.log(err)
    } else {
      console.log(result);

      obj.gioihantren = result[0].gioihantren;
      obj.gioihanduoi = result[0].gioihanduoi;


      var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
      con.query(select, function (err, result, data) {
        if (err) {
          console.log(err);
        } else {

          data = result[0];
          console.log(data);
          res.render('trangthaimotor', { title: 'Express', data: data, obj: obj, status: status });

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
router.post('/tatmotor', function (req, res, next) {
  // MQTT publisher
  var client = mqtt.connect(ip)
  var topic = 'Topic/Speaker'
  // var message = 'Hello tempt! 1'
  var message = [{ "device_id": "Speaker", "values": ["0", "80"] }]
  var mess = JSON.stringify(message);
  client.on('connect', () => {

    client.publish(topic, mess);
    console.log('Message off motor sent!',)
    res.redirect('/trangthaimotor');

  })

  //1883

});
/* Mở motor*/
router.post('/momotor', function (req, res, next) {
  // MQTT publisher
  var client = mqtt.connect(ip)
  var topic = 'Topic/Speaker'
  // var message = 'Hello tempt! 1'
  var message = [{ "device_id": "Speaker", "values": ["1", "80"] }]
  var mess = JSON.stringify(message);
  client.on('connect', () => {

    client.publish(topic, mess);
    console.log('Message off motor sent!',)
    res.redirect('/trangthaimotor');

  })

  //1883

});

/* POSt giá trị giới hạn hiện tại*/
router.post('/getlimit', function (req, res, next) {
  var up = req.body.up;
  var down = req.body.down;
  var status;

  var data = [];
  if (up - 2 >= down) {

    //lay gioi han nhiet do

    var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
    con.query(select, function (err, result) {

      if (err) {
        console.log(err);
      } else {
        data = result[0];

        var select = `insert into iot.LIMITTEMPT (gioihantren, gioihanduoi, timecreate) values(${up},${down},'${d}')`;
        con.query(select, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            var obj = {
              "gioihantren": up,
              "gioihanduoi": down
            }
            status = 'Lưu thành công';

            res.render('trangthaimotor', { title: 'Express', data: data, obj: obj, status: status });
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
    var selectdblimit = `SELECT * FROM iot.LIMITTEMPT where id = (select Max(id) from iot.Motor); `;
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

            status = 'Khoảng cách nhiệt độ phải lớn hơn 1';

            res.render('trangthaimotor', { title: 'Express', data: data, obj: obj, status: status });

          }
        })
      }

    });

  }


})
/* GET Dang ki page. */
router.get('/dangki', controller.dangki);
/* POST home page. */
router.post('/dangki', controller.xacthucdangki);
//Login
router.get('/dangnhap', controller.dangnhap);
//Xac thuc dang nhap
router.post('/xacthucdangnhap', auth.xacthucdangnhap);
module.exports = router;
