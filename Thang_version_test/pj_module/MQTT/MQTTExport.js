const mqtt = require('mqtt')
const mqttConfig = require('../Config/MQTT')
const DBMS = require('../Config/DBMS');
const Hash = require('js-sha1');
const Analyze = require('../AnalyzeCondition/AnalyzeExport')



// let listTopicOnline = []
var client = null
exports.initMQTTConnect = async function (io, User, ObjectId) {
    client = await mqtt.connect(mqttConfig.connectConfig)

    client.on('connect', function () {
        client.subscribe(mqttConfig.GpsTopic, function (err, topic) {
            if (err) console.log(err)
            client.on('message', async function (topic, message) {
                // console.log(topic)
                if (topic == "Topic/GPS") {
                    // let Collection = getCollectionContain(message.device_id)
                    message = JSON.parse(message.toString())
                    // console.log(message)
                    let i = 0
                    for (i; i < message.length; i++) {
                        // message.forEach(async element => {
                        let DVID = Hash(message[i].device_id).substring(0, 12)
                        let id = ObjectId(DVID)
                        let returnVal = await User.collection(DBMS.GPSDeviceCollection).findOne(
                            { _id: id }
                        )
                        let data = [parseFloat(message[i].values[0]), parseFloat(message[i].values[1])]
                        if (returnVal == null) {
                            User.collection(DBMS.GPSDeviceCollection).insertOne({
                                _id: id,
                                DeviceStatus: 0,
                                DeviceOwnerID: "",
                                DeviceName:"GPS",
                                DeviceDateIn: new Date().toISOString().substring(0, 10),
                                DeviceData: {
                                    Longitude: data[0],
                                    Latitude: data[1]
                                }
                            })
                        } else {
                            let res = await User.collection(DBMS.GPSDeviceCollection).updateOne({
                                _id: id,
                                $or: [
                                    { "DeviceData.Longitude": { $ne: data[0] } },
                                    { "DeviceData.Latitude": { $ne: data[1] } }]
                            }
                                ,
                                {
                                    $set: {
                                        DeviceData: {
                                            Longitude: data[0],
                                            Latitude: data[1]
                                        }
                                    }
                                }
                            )
                            if (res.modifiedCount == 1) {
                                io.to(returnVal.DeviceOwnerID).emit('emit-new-gps', {
                                    gpsID: id,
                                    data: data
                                })
                            }
                        }

                    }
                    Analyze.AnalyzesSystem()
                    // let myInterval = setInterval(() => {
                    //     if (i == message.length) {
                    //         clearInterval(myInterval)
                    //     }
                    // }, 1)
                }
                else if (topic == "Topic/LightD") {
                    message = JSON.parse(message.toString())
                    // console.log(message)
                    let i = 0
                    for (i; i < message.length; i++) {
                        // message.forEach(async element => {
                        let DVID = Hash(message[i].device_id).substring(0, 12)
                        let id = ObjectId(DVID)
                        let returnVal = await User.collection(DBMS.NTFDeviceCollection).findOne(
                            { _id: id }
                        )
                        if (returnVal == null) {
                            User.collection(DBMS.NTFDeviceCollection).insertOne({
                                _id: id,
                                DeviceStatus: 0,
                                DeviceOwnerID: "",
                                DeviceName:"LED",
                                DeviceDateIn: new Date().toISOString().substring(0, 10),
                                DeviceData: [255,255]
                            })
                        } else {
                        }
                }
            })
        })
    })
}


exports.publicizeToDevice = async function (deviceID, tmp, status) {
    if (tmp == 0 && status == 1) {
        client.publish(mqttConfig.NotifyTopic,
            JSON.stringify([
                {
                    device_id: "LightD",
                    values: ['0', '0']
                }
            ])
        )
    }
    else if(tmp == 1 && status == 0){
        client.publish(mqttConfig.NotifyTopic,
            JSON.stringify([
                {
                    device_id: "LightD",
                    values: ['1', '255']
                }
            ])
        )
    }
}
