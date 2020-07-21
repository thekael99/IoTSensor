const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Config = require('../../Config/GConfig')
const AuthFunction = require('../AuthFunction/AuthFunction')


module.exports = function (passport, User, ObjectId) {
    passport.use("google", new GoogleStrategy({
        clientID: Config.ClientID,
        clientSecret: Config.ClientSecret,
        callbackURL: "/auth/google/callback"
    },AuthFunction.GoogleStrategy))
}