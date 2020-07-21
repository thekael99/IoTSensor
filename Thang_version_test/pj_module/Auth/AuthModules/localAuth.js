const LocalStrategy = require('passport-local').Strategy;
const AuthFunction = require('../AuthFunction/AuthFunction.js')
module.exports = (passport, User) => {
    passport.use('authClient',new LocalStrategy( AuthFunction.LocalStragegyClient
    ))
    passport.use('authAdm',new LocalStrategy(  AuthFunction.LocalStragegyAdm ))
}