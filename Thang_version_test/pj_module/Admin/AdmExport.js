
// app: Server listening request and response to client side
// User: Database
const DBMS = require('../Config/DBMS')
const Mail = require('../MailInf/MailExport');
const Parse = require('./AdmModule/Parse')

module.exports = function (app, User, ObjectId) {

    app.post('/admin-home/get-mini-acc-state', async (req, res) => {
        let returnVal = await User.collection(DBMS.ClientInfoCollection).aggregate([
            { $group: { _id: "$State", count: { $sum: 1 } } }
            , { $sort: { _id: 1 } }
        ]).toArray()
        res.send(returnVal)
    })

    app.post('/admin-home/get-mini-acc-level', async (req, res) => {
        let returnVal = await User.collection(DBMS.ClientInfoCollection).aggregate([
            { $group: { _id: "$Level.NowLevel", count: { $sum: 1 } } }
            , { $sort: { _id: 1 } }
        ]).toArray()
        for (let x = returnVal.length - 1; x < 3; x++) {
            returnVal.push({ count: 0 })
        }
        res.send(returnVal)
    })

    app.post('/admin-home/get-mini-device', async (req, res) => {
        let GPSSize = await User.collection(DBMS.GPSDeviceCollection).countDocuments()
        let LEDSize = await User.collection(DBMS.NTFDeviceCollection).countDocuments()
        res.send([LEDSize, GPSSize])
    })



    app.post('/auth/admin-is-loggin', (req, res) => {
        res.send(req.isAuthenticated() && !req.body.typePosition)
    })

    app.post('/adm/get-full-account-to-render', async (req, res) => {
        User.collection(DBMS.ClientInfoCollection).find({}
            , { projection: { _id: 1, Fname: 1, Lname: 1, Contact: 1, Email: 1, LastAccess: 1 } }).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                    res.send([])
                }
                else {
                    res.send(result)
                }
            })
    })

    app.post('/adm/get-peer-profile', async (req, res) => {
        let returnVal = {}
        let dbrt = await User.collection(DBMS.ClientInfoCollection).findOne({ "_id": ObjectId(req.body.id) })
        returnVal.id = dbrt._id
        returnVal.FullName = dbrt.Fname + " " + dbrt.Lname;
        returnVal.Email = dbrt.Email;
        returnVal.Contact = dbrt.Contact;
        returnVal.DateIn = dbrt.DateIn;
        returnVal.Address = dbrt.Address
        returnVal.LastAccess = dbrt.LastAccess;
        returnVal.DOB = dbrt.DOB
        returnVal.DateIn = dbrt.DateIn
        returnVal.State = Parse.parseState(dbrt.State);
        returnVal.Level = Parse.parseLevel(dbrt.Level.NowLevel)
        res.send(returnVal)
    })

    app.post('/adm/get-sys-acc-state', async (req, res) => {
        let returnVal = {};
        returnVal.total = await User.collection(DBMS.ClientAuthCollection).find().count()
        returnVal.new = await User.collection(DBMS.ClientInfoCollection).find(
            {
                "DateIn": new Date().toISOString().substring(0, 10)
            }
        ).count()
        returnVal.expire = await User.collection(DBMS.ClientInfoCollection).find(
            {
                "State": 3
            }
        ).count()
        res.send(returnVal);
    })

    app.post('/admin/get-account-development-dashboard', async (req, res) => {
        let DayStart = Parse.parseDateStart(req.body.dashboardType, req.body.displayType)
        let returnVal = await User.collection(DBMS.ClientInfoCollection).aggregate(
            [
                { $match: { DateIn: { $gte: DayStart[0] } } },
                { $group: { _id: "$DateIn", count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]
        ).toArray()
        res.send({
            data: Parse.parseDateDash(returnVal, DayStart[0]),
            labels: DayStart[1]
        })
    })

    app.post('/adm-message/get-mini-list', async (req, res) => {
        let returnVal = await User.collection(DBMS.MessageCollection).aggregate([
            {
                $match: {
                    isReading: 0
                }
            }
            ,
            {
                $lookup: {
                    from: DBMS.ClientInfoCollection,
                    localField: "_id",    // field in the orders collection
                    foreignField: "_id",  // field in the items collection
                    as: "fromItems"
                }
            },
            {
                $replaceRoot:
                {
                    newRoot:
                    {
                        $mergeObjects:
                            [
                                {
                                    $arrayElemAt:
                                        ["$fromItems", 0]
                                }, "$$ROOT"
                            ]
                    }
                }
            }
            ,
            {
                $project:
                {
                    _id: 1, Fname: 1, Lname: 1, Email: 1, Date: 1,
                    message: { $substr: ["$message", 0, 50] }
                }
            }
        ]
        ).toArray()
        if (returnVal) {
            res.send(returnVal)
        }
        else {

        }
    })

    app.post('/adm-message/get-full-msg', async (req, res) => {
        let returnVal = (await User.collection(DBMS.MessageCollection).findOne({
            _id: ObjectId(req.body.userID)
        }
            , { projection: { message: 1 } })).message
        res.send(returnVal)
    })

    app.post('/adm-message/send-mail', async (req, res) => {
        let userMessage = (await User.collection(DBMS.MessageCollection).findOneAndUpdate(
            {
                _id: ObjectId(req.body.userID)
            },
            {
                $set: {
                    message: "",
                    isReading: 1,
                    total: 0,
                    Date: ""
                }
            }
            ,
            {
                projection: { message: 1 }
            }
        )).value.message
        console.log(userMessage)

        let Options = parseMail(req.body.recieveMail, userMessage, req.body.message)
        Mail.sendMail(res, Options)
    })

    app.post('/logout-request', (req, res) => {
        req.logout()
        res.send(true)
    })

    app.get('/admin*', (req, res) => {
        res.render('admin')
    })
}
function parseMail(recieveMail, userMessage, adminMessage) {
    return {
        from: 'Azbot-IotSystem',
        to: recieveMail,
        subject: "Message response",
        html: `
        <h3>About your message </h3>
        ${userMessage}
        <h2>Here is my response</h2>
        ${adminMessage}
        `
    }
}