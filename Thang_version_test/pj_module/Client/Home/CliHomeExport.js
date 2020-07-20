

const DBMS = require('../../Config/DBMS')

module.exports = function (app, User, ObjectId) {

    app.get('/device-trackings', (req,res)=>{
        if (req.isAuthenticated() && req.user.typePosition){
            res.render('deviceMain',{ id: req.user.id })
        }
    })

    app.get("/home", function (req, res) {
        if (req.isAuthenticated() && req.user.typePosition) {
            res.render('CliHome')
        }
        else {
            res.redirect('/')
        }
    });

    app.post('/cli-home/get-some-infor', async (req, res) => {
        let returnVal = await User.collection(DBMS.ClientInfoCollection).findOne({
            _id: ObjectId(req.user.id)
        }, {
            projection: {
                Fname: 1,
                Lname: 1,
                Email: 1,
                Contact: 1,
                Address: 1,
                DOB: 1,
                Avatar: 1
            }
        })
        res.send(returnVal)
    })

    app.post('/cus-consufused/request', async (req, res) => {
        let returnVal = await User.collection(DBMS.MessageCollection).updateOne({
            _id: ObjectId(req.user.id),
            total: { $lt: 5 }
        }, {
            $set: {
                message: req.body.Text,
                isReading: 0,
                Date: new Date().toISOString()
            }
            ,
            $inc: {
                total: 1
            }
        }
        )
        if (returnVal.matchedCount) {
            res.send(true)
        }
        else {
            res.send(false)
        }
    })
}