
const DBMS = require('../../Config/DBMS');
const Hash = require('../AuthSecure/Hash')

var User = null
var ObjectId = null

exports.configureFunction = (user, obj) => {
    User = user
    ObjectId = obj
}

// Client side function 
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Let see, you send to opener window some action, because your sessions is stored!!
// Then. u will closed the window. Let some demo
exports.clientLoginDone = (req, res) => {
    console.log("OKOK")
    res.write(`
            <script>
                window.opener.location.replace('/home');
                window.close()
            </script>
            `)
}


exports.LocalStragegyClient = (user, pass, done) => {
    User.collection(DBMS.ClientAuthCollection).findOne({ username: user }, (err, res) => {
        if (err) return done(err, null);
        if (!res) return done(null, res);
        if (Hash.Pass(pass) === res.password) {
            // console.log(Hash.Pass(pass))
            // console.log(res.password)
            // console.log(Hash.Pass(pass) === res.password)
            return done(null, {
                id: res._id,
                typePosition: true
            });
        }
        else {
            return done(null, false, { message: "Password incorrect" })
        }
    })
}

exports.LocalStragegyAdm = (user, pass, done) => {
    User.collection(DBMS.AdminAuthCollection).findOne({ username: user }, (err, res) => {
        if (err) return done(err, null);
        if (!res) return done(null, res);
        if (Hash.Pass(pass) == res.password) {
            return done(null, {
                id: res._id,
                typePosition: false
            });
        }
        else {
            return done(null, false, { message: "Password incorrect" })
        }
    })
}


exports.AuthLocalSignUp = async (req, res, next) => {
    checkData = await User.collection(DBMS.ClientAuthCollection).findOne({ "username": req.body.username })
    if (checkData == null) {
        let id = await User.collection(DBMS.ClientAuthCollection).insertOne({
            username: req.body.username,
            password: Hash.Pass(req.body.password),
            typePosition: true
        })
        id = id.ops[0]._id
        // console.log("ID:", id)
        let Dat = new Date().toISOString().substring(0, 10)
        // let DMY = Dat.getDate() + "/" + (Dat.getMonth()+1) + "/" + Dat.getFullYear();
        User.collection(DBMS.MessageCollection).insertOne({
            _id:ObjectId(id),
            Date:"",
            isReading:1,
            message:"",
            total:0
        })
        await User.collection(DBMS.ClientInfoCollection).insertOne({
            "_id": ObjectId(id),
            Fname: "Not Update",
            Lname: "",
            Email: req.body.username,
            Contact: "+84000000000",
            Balance: 0,
            DOB: '1999-01-01',
            Gender: 0,
            Address: "",
            DateIn: Dat,
            LastAccess: Dat,
            Avatar:"/views/pblic/img/logo.png",
            State: 0,
            Level: {
                NowLevel: 0,
                HisLevel: {
                    Normal: 1,
                    Medium: 0,
                    Premium: 0
                }
            }
        })
        res.send(true)
        // console.log("has been sent")
        
    }
    else {
        res.send(false)
    }
}

exports.deserializeUser = function (user, done) {
    User.collection(DBMS.ClientAuthCollection).findOne({ _id: ObjectId(user.id) }, function (err, res) {
        if (err) console.log(err)
        if (res == null) {
            User.collection(DBMS.AdminAuthCollection).findOne({ _id: ObjectId(user.id) }, function (err, res2) {
                if (err) console.log(err)
                if (res2 == null) {
                    return done(null, false)
                }
                else {
                    return done(null, user);
                }
            })
        }
        else {
            return done(null, user);
        }
    });
}

exports.GoogleStrategy = function (accessToken, refreshToken, profile, done) {
    // console.log(profile)
    profile = profile._json;
    if (profile.email_verified) {
        User.collection(DBMS.ClientAuthCollection).findOne({ username: profile.email }, (err, res) => {
            if (err) return done(err, null);
            if (res == null) {
                User.collection(DBMS.ClientAuthCollection).insertOne({
                    username: profile.email,
                    password: Hash.Pass(Hash.Select(profile.sub)),
                    typePosition: true
                }
                    , (err, user) => {
                        if (err) throw err;
                        else {
                            id = user.ops[0]._id
                            GoogleAddNewClient(User, profile, ObjectId(id))
                            return done(null, {
                                id: id,
                                typePosition: true
                            });
                        }
                    }
                )
            }
            else {
                if (Hash.Pass(Hash.Select(profile.sub)) === res.password) {
                    return done(null, {
                        id: res._id,
                        typePosition: true
                    }
                    );
                }
                else {
                    return done(null, false)
                }
            }
        })
    }
    else {
        return done(null, false, { message: 'Email is not verify' });
    }
}

function GoogleAddNewClient(User, profile, ObjectId) {
    // console.log(profile)
    let Dat = new Date().toISOString().substring(0, 10)
    // let DMY = Dat.getDate() + "/" + (Dat.getMonth()+1) + "/" + Dat.getFullYear();
    User.collection(DBMS.ClientInfoCollection).insertOne({
        "_id": ObjectId,
        Fname: profile.family_name,
        Lname: profile.given_name,
        Email: profile.email,
        Contact: "+84000000000",
        Balance: 0,
        DOB: '1999-01-01',
        Gender: 0,
        Address: "",
        DateIn: Dat,
        LastAccess: Dat,
        Avatar:profile.picture,
        State: 0,
        Level: {
            NowLevel: 0,
            HisLevel: {
                Normal: 1,
                Medium: 0,
                Premium: 0
            }
        }
    }, (err) => {
        if (err)
            console.log(err)
    })
    User.collection(DBMS.MessageCollection).insertOne({
        _id:ObjectId,
        Date:"",
        isReading:1,
        message:"",
        total:0
    })
}

// Admin side function
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

exports.adminLoginFunc = (req, res) => {
    let redirectAdminPage = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <form style="display:none;" action="/auth/adm-requi-log-local" method="POST">
        <input type="text" value="${req.params.user}" name="username">
        <input type="text" value="${req.params.pass}" name="password">
        <button type="submit" id="buttonForm"></button>
    </form>
    <script>
        document.getElementById('buttonForm').click()
    </script>
</body>
</html>
    `
    res.send(redirectAdminPage)
}