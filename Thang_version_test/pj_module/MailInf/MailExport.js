const NodeMailer = require('nodemailer')
const AESCrypto = require('aes256')
const Hash = require('js-sha1')
const DBMS = require('../Config/DBMS')
const Parse = require('./ParseMail/ParseMail')
const Time = require('../Config/Time')
var mailServer = null;

function sendMail(res, Options) {
    mailServer.sendMail(Options, (err, info) => {
        if (err) {
            console.log(err);
            res.send(false)
        } else {
            res.send(true)
        }
    })
}
exports.initMailServer = function (app, User, ObjectId) {
    mailServer = NodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'azbot.iot@gmail.com',
            pass: 'buiphilong'
        },
    });
    app.post('/adm/send-mail-renew-password', async (req, res, next) => {
        let returnVal = await User.collection(DBMS.ClientAuthCollection).findOne({
            username:req.body.email
        })
        let id = returnVal._id.toString()
        

        let encrypt = AESCrypto.encrypt(id.substring(0, 13), id)
        let output = id.substring(0, 13) + encrypt


        await User.collection(DBMS.ActionLinkCollection).updateOne({
            _id: returnVal._id
        }, {
            $set: {
                Route: '/cli/renew-password-decrypt/' + output,
                Time: new Date().getTime()
            }
        }, {
            upsert: true
        }
        )
        // console.log(req.body)
        sendMail(res, Parse.RenewMail(req.body.email,output))
    })


    app.get('/cli/renew-password-decrypt/*', async (req, res, next) => {
        let decrypt = AESCrypto.decrypt(req.params[0].substring(0, 13), req.params[0].substring(13))
        let returnValue = await User.collection(DBMS.ActionLinkCollection).findOne({
            _id: ObjectId(decrypt)
        },{projection:{Time:1,Count:1}})
        if (returnValue != null) {
            let isExpireTime = (new Date().getTime()-returnValue.Time)/60000;
            if (isExpireTime > Time.Renew){
                res.send("<h1>That link had been expired</h1>")
            }
            else{
                res.render('renew')
            }
        }
        else{
            res.send("<h1>That link had been expired</h1>")
        }
    })

    app.post('/cli/renew-password-decrypt/*', async (req, res, next) => {
        let decrypt = AESCrypto.decrypt(req.params[0].substring(0,13),req.params[0].substring(13))
        console.log(decrypt)
        let returnVal = User.collection(DBMS.ClientAuthCollection).updateOne({
            _id:ObjectId(decrypt)
        },{$set:{
            password:Hash(req.body.pw1)
        }})
        if(returnVal == null){
            res.send(false)
        }
        else{
            res.send(true)
        }
    })

    app.post('/cli/check-exist-email',async (req,res,next)=>{
        User.collection(DBMS.ClientAuthCollection).findOne({
            username:req.body.mail
        },(err,result)=>{
            if(err) console.log(err);
            else{
                if(result === null){
                    res.send(false);
                }
                else{
                    res.send(true);
                }
            }
        })
    })

}
exports.sendMail = sendMail

