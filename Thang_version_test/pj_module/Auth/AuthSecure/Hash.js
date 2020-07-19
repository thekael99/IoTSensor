const Hash = require('js-sha1')
module.exports ={
    Pass: function(password){
        return Hash(password)
    },
    Select: function(sub =""){
        return sub.substring(0,15);
    }
}