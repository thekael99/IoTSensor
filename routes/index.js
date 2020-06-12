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

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin123",
  port: "3306",
  database: "iot"
});

// execute your request here
// MQTT subscriber
var mqtt = require('mqtt');
const { log } = require('debug');
const { json } = require('express');
var client = mqtt.connect('mqtt://52.188.19.7:1883')
//mqtt://13.76.250.158:1883
//mqtt://52.188.19.7:1883
var topic = 'Topic/TempHumi'

client.on('message', (topic, message) => {
  //  message = message.toString();
  message = JSON.parse(message)[0];


  //   //Ket noi
  var insert = `INSERT INTO CamBien (device,nhietdo,doam) values ('${message.device_id}','${message.values[0]}','${message.values[1]}') `

  con.query(insert, function (err, result, fields) {
    if (err) throw err;
  });
})

client.on('connect', () => {
  client.subscribe(topic)
})

/* GET home page. */
router.get('/', function (req, res, next) {
  // //Ket noi
  // con.connect(function(err) {
  //  // if (err) throw err;
  //   con.query("SELECT * FROM user", function (err, result, fields) {
  //    if (err) throw err;
  //     console.log(result);


   //Ket noi
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


  //   });
  // });
});
/* API data . */
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
/* GET Dang ki page. */
router.get('/dangki', controller.dangki);
/* POST home page. */
router.post('/dangki', controller.xacthucdangki);
//Login
router.get('/dangnhap', controller.dangnhap);
//Xac thuc dang nhap
router.post('/xacthucdangnhap', auth.xacthucdangnhap);
module.exports = router;
