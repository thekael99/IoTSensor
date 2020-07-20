const DBMS = require('../Config/DBMS')
// const MQTT = require('../Config/MQTT')



module.exports = function (io, User, ObjectId, MQTTServer) {

    User = User.collection(DBMS.GPSDeviceCollection)
    io.on("connection", function (socket) {

        socket.on('sign-in-socket', clientID => {
            socket.join(clientID)
        })
        socket.on('disconnect',data=>{
        })
    }
    );
}