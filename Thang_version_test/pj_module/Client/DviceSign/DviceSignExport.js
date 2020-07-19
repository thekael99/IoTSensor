
// app: Server listening request and response to client side
// User: Database
const DBMS = require('../../Config/DBMS')
const Hash = require('js-sha1')

module.exports = function (app, User, ObjectId) {
    app.get('/device-settings', (req, res) => {
        res.render('addDevice', { id: req.user.id })
    })

    app.post('/cli-main/search-device', async (req, res) => {
        let hashPass = ObjectId(Hash(req.body.DeviceID).substring(0, 12))
        let returnVal = await User.collection(DBMS.GPSDeviceCollection).findOne({
            _id: hashPass,
            DeviceOwnerID: ""
        })
        if (returnVal) {
            res.send({
                DeviceID: hashPass,
                DeviceName: "GPS",
                Devicetype: 0,
                Devicestatus: returnVal.DeviceStatus
            })
        }
        else {
            returnVal = await User.collection(DBMS.NTFDeviceCollection).findOne({
                _id: hashPass,
                DeviceOwnerID: ""
            })
            if (returnVal) {
                res.send({
                    DeviceID: hashPass,
                    DeviceName: "LED",
                    Devicetype: 1,
                    Devicestatus: returnVal.DeviceStatus
                })
            }
            else {
                res.send(false)
            }
        }
    })


    app.post('/cli-main/add-device', async (req, res) => {
        // console.log("On add device:\n", req.body)
        let hashPass = ObjectId(Hash(req.body.DeviceID).substring(0, 12))
        let returnVal = await User.collection(DBMS.GPSDeviceCollection).updateOne({
            _id: hashPass
        }, {
            $set: {
                DeviceOwnerID: req.user.id
            }
        })
        // console.log(returnVal)
        if (returnVal.modifiedCount) {
            User.collection(DBMS.ClientDeviceControl).insertOne({
                OwnerID: req.user.id,
                GPSID: hashPass+"",
                InformID: "",
                Data: []
            })
            res.send(true)
        }
        else {
            returnVal = await User.collection(DBMS.NTFDeviceCollection).updateOne({
                _id: hashPass
            }, {
                $set: {
                    DeviceOwnerID: req.user.id
                }
            })
            if (returnVal.modifiedCount){
                res.send(true)
            }
            else{
                res.send(false)
            }
        }
    })
    app.post('/cli-main/get-all-device', async (req, res) => {

        // console.log("On get devices:\n", req.body)
        let GPSList = await User.collection(DBMS.GPSDeviceCollection).find({
            DeviceOwnerID:  req.user.id
        }, {
            projection: {
                _id: 1,
                DeviceName: 1
            }
        }).toArray()
        let lst = []
        for (let i = 0; i < GPSList.length; i++) {
            lst.push({
                DeviceID: GPSList[i]._id,
                DeviceName: GPSList[i].DeviceName,
                Devicetype: 0
            }
            )
        }
        let InformList = await User.collection(DBMS.NTFDeviceCollection).find({
            DeviceOwnerID:  req.user.id
        },{
            projection: {
                _id: 1,
                DeviceName: 1
            }
        }).toArray()

        for (let i = 0; i < InformList.length; i++) {
            lst.push({
                DeviceID: InformList[i]._id,
                DeviceName: InformList[i].DeviceName,
                Devicetype: 1
            }
            )
        }

        res.send(lst)
    })
    app.post('/cli-main/settings-device', (req, res) => {
        // console.log("On settings devices:\n", req.body)
        let List = JSON.parse(req.body.List)
        for(let i = 0; i < List.length; i++){
            User.collection(DBMS.ClientDeviceControl).updateOne({
                GPSID:List[i][0]
            },{
                $set:{
                    InformID:List[i][1]
                }
            })
        }
        res.send(true)
    })
}