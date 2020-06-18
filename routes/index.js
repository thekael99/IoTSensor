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
var client = mqtt.connect('mqtt://52.188.19.7:1883')
//mqtt://13.76.250.158:1883
//mqtt://52.188.19.7:1883

//Sub sensor start
var topicSensor = 'Topic/TempHumi';

client.on('message', (topicSensor, message) => {
  //  message = message.toString();
  message = JSON.parse(message)[0];
  if(message.device_id == 'TempHumi '){

  
   //Ket noi
  var insert = `INSERT INTO CamBien (device,nhietdo,doam) values ('${message.device_id}','${message.values[0]}','${message.values[1]}') `

  con.query(insert, function (err, result, fields) {
    if (err) throw err;
  });
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

  if(message.device_id == 'Speaker'){

   //Ket noi
  var insert = `INSERT INTO Motor (device,trangthai,value) values ('${message.device_id}','${message.values[0]}','${message.values[1]}') `

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
  var select = `SELECT * FROM CamBien where idCamBien `;
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
var data;
var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
con.query(select, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    
    data = result[0]
    console.log(data);
    res.render('trangthaimotor', { title: 'Express',  data: data });

  })
  


});
/* API data motor . */
router.get('/apimotor', function (req, res, next) {
  var select = `SELECT * FROM iot.Motor where idMotor = (select Max(idMotor) from iot.Motor); `;
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    res.send(result);

  });
});

//So sanh nhiet do de mo tat motor (so sanh voi compare)
router.get('/sosanhnhietdo', function (req, res, next) {
  var select = `SELECT * FROM CamBien where idCamBien `;
  const compare = 30;
  con.query(select, function (err, result, fields) {
    if (err) throw err;
    if (result == compare) {
      var mqtt = require('mqtt')
      var client = mqtt.connect('mqtt://52.188.19.7:1883')
      var topic = 'Topic/Speaker'
      var message = [   {   "device_id": "Speaker",     "values": ["1", "80"]   } ]
          var mess = JSON.stringify (message);
      client.on('connect', ()=>{
        
              client.publish(topic, mess);
              console.log('Message off motor sent!',)
              res.redirect('/trangthaimotor');        
      })
    } else {
      var mqtt = require('mqtt')
      var client = mqtt.connect('mqtt://52.188.19.7:1883')
      var topic = 'Topic/Speaker'
      var message = [   {   "device_id": "Speaker",     "values": ["0", "80"]   } ]
          var mess = JSON.stringify (message);
      client.on('connect', ()=>{
        
              client.publish(topic, mess);
              console.log('Message off motor sent!',)
              res.redirect('/trangthaimotor');
            })
    }
  });

/* Tắt motor*/
router.post('/tatmotor', function (req, res, next) {
// MQTT publisher
var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://52.188.19.7:1883')
var topic = 'Topic/Speaker'
// var message = 'Hello tempt! 1'
var message = [   {   "device_id": "Speaker",     "values": ["0", "80"]   } ]
    var mess = JSON.stringify (message);
client.on('connect', ()=>{
  
        client.publish(topic, mess);
        console.log('Message off motor sent!',)
        res.redirect('/trangthaimotor');
   
})

//1883

});
/* Mở motor*/
router.post('/momotor', function (req, res, next) {
  // MQTT publisher
  var mqtt = require('mqtt')
  var client = mqtt.connect('mqtt://52.188.19.7:1883')
  var topic = 'Topic/Speaker'
  // var message = 'Hello tempt! 1'
  var message = [   {   "device_id": "Speaker",     "values": ["1", "80"]   } ]
      var mess = JSON.stringify (message);
  client.on('connect', ()=>{
    
          client.publish(topic, mess);
          console.log('Message off motor sent!',)
          res.redirect('/trangthaimotor');
     
  })
  
  //1883
  
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
