const passport = require("passport")
const googleAuth = require('./AuthModules/googleAuth');
const localAuth = require('./AuthModules/localAuth.js');
const AuthFunction = require('./AuthFunction/AuthFunction')

module.exports = function (app, User, ObjectId) {
    app.use(passport.initialize());
    app.use(passport.session());

    googleAuth(passport, User, ObjectId);
    localAuth(passport, User);

    AuthFunction.configureFunction(User, ObjectId)

    app.get('/auth/google',
        passport.authenticate('google', { scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/user.birthday.read'
        ] }));
        // Fist, we have to connect some api scope google support

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/google-login-fail' }),
        function (req, res) {
            res.redirect('/login-done'); // Here, if u sign up completed, u will render or send some to parent
        });

    // app.post('/auth/require-log-local-sign',
    //     passport.authenticate('authClient', { failureMessage: '/' }), function (req, res) {
    //         res.send(true)
    //     })

    app.post('/auth/require-log-local-sign', function (req, res, next) {
        passport.authenticate('authClient', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.send(false) }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                return res.send(true);
            });
        })(req, res, next);
    });
    // app.get('/auth/require-log-local-sign',
    // passport.authenticate('authClient', { failureRedirect: '/' , successRedirect:"/home"}))

    app.post('/auth/adm-requi-log-local',
        passport.authenticate('authAdm', { failureRedirect: '/' }), function (req, res) {
            res.redirect('/admin')
        })

    app.get('/google-login-fail', (req, res) => {
        res.send('<h1>Login Failed, Your email has been already use!</h1>')
    })

    app.get('/login-done', AuthFunction.clientLoginDone)

    app.get('/auth/adm/:user&-&:pass', AuthFunction.adminLoginFunc)

    app.post('/auth/require-log-local-sign-up', AuthFunction.AuthLocalSignUp)

    passport.serializeUser(function (user, done) {
        return done(null, user);
    });

    passport.deserializeUser(AuthFunction.deserializeUser);
}