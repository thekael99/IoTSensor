
// app: Server listening request and response to client side
// User: Database
// Huynh NGO TRUONG DAT
const DBMS = require('../../Config/DBMS')

module.exports = function (app, User, ObjectId) {
    app.post('/cli-acc/show-prof', async (req, res) => {
        let returnVal = await User.collection(DBMS.ClientInfoCollection).findOne({
            _id: ObjectId(req.user.id)
        },
            {
                projection: {
                    id: 1,
                    Fname: 1,
                    Lname: 1,
                    Email: 1,
                    Contact: 1,
                    DOB: 1,
                    Gender: 1,
                    Address: 1,
                    Balance: 1,
                    Level: 1
                }
            }
        )
        if (returnVal != null)
            res.send(returnVal)
    })
    app.post('/cli-acc/update-prof', async (req, res) => {
        let returnVal = await User.collection(DBMS.ClientInfoCollection).updateOne({
            _id: ObjectId(req.user.id)
        },
            {
                $set: {
                    Fname: req.body.Nname,
                    Lname: req.body.Fname,
                    Contact: req.body.Contact,
                    DOB: req.body.DOB,
                    Gender: req.body.Gender,
                    Address: req.body.Address
                }
            }
        )
        console.log(returnVal)
        if (returnVal.modifiedCount) {
            res.send(true)
        }
        else {
            res.send(false)
        }
    })
    app.post('/cli-acc/upgrade-account', async (req, res) => {
        if (req.body.MediumLv + req.body.IntermediateLv + req.body.PreminumLv > 1) {
            res.redirect('/update-balance')
        }
        else {
            index = -1
            if (req.body.MediumLv) index = 0
            if (req.body.IntermediateLv) index = 1
            if (req.body.PreminumLv) index = 2

            let returnVal = await User.findOne({
                _id: ObjectId(req.user.id)
            }, { projection: { Balance: 1, Level: 1 } })
            if (returnVal.Balance > 100 * index) {
                lv = returnVal.Level.HistLevel
                lvx = {
                    nowLevel: index,
                    HistLevel: {
                        Normal: (index == 0) ? lv.Normal + 1 : lv.Normal,
                        Medium: (index == 1) ? lv.Normal + 1 : lv.Normal,
                        Premium: (index == 2) ? lv.Normal + 1 : lv.Normal
                    }
                }
                let returnVal2 = await User.updateOne({
                    _id: ObjectId(req.user.id)
                }, {
                    $set: {
                        Level: lvx
                    }
                })
                if (returnVal2.modifiedCount) {
                    res.send({
                        UserBalance: returnVal.Balance - 100 * index,
                        UserLevel: index
                    })
                }
                else {

                }
            }
            else {
                res.redirect('update-balance')
            }
        }
    })
    app.post('/cli-acc/update-balance', async (req, res) => {
        let returnVal = await User.collection(DBMS.ClientInfoCollection).updateOne({
            _id:ObjectId(req.user.id)
        },{
            $inc:{
                Balance:parseFloat(req.body.Deposit)
            }
        })
        if (returnVal){
            returnVal = await User.collection(DBMS.ClientInfoCollection).findOne({
                _id:ObjectId(req.user.id)
            },{projection:{Balance:1}})
            res.send(returnVal.Balance)
        }
    })
}