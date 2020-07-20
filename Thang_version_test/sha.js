
const Hash = require('js-sha1')
for (let i = 1; i < 5; i++){
    console.log(Hash("LightD"+i).substring(0, 12))
}
