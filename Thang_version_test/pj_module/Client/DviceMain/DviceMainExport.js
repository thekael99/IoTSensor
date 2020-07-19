const DBMS = require("../../Config/DBMS");

// app: Server listening request and response to client side
// User: Database

module.exports = function (app, Users, ObjectId) {

  app.post("/cli-main/get-gps-information", (req, res) => {
    Users.collection(DBMS.GPSDeviceCollection)
      .find(
        {
          DeviceOwnerID: req.user.id,
        },
        { projection: { DeviceStatus: 1, DeviceData: 1 } }
      )
      .toArray(function (err, response) {
        // console.log(response)
        res.send(response);
      });
  });

  app.post("/cli-main/update-zone-latLngRad", (req, res) => {
    var DataIndex = {};
    DataIndex["Data." + req.body.index] = [
      parseInt(req.body.Radius),
      parseFloat(req.body.Long),
      parseFloat(req.body.Lat),
    ];
    Users.collection(DBMS.ClientDeviceControl).updateOne(
      {
        OwnerID: req.user.id,
        GPSID: req.body.GPSID,
      },
      {
        $set: DataIndex,
      }
    );
    res.send("zone update");
  });

  app.post("/cli-main/add-new-zone", (req, res) => {
    Users.collection(DBMS.ClientDeviceControl).updateOne(
      {
        OwnerID: req.user.id,
        GPSID: req.body.GPSID,
      },
      {
        $push: {
          Data: [
            parseInt(req.body.Radius),
            parseFloat(req.body.Long),
            parseFloat(req.body.Lat),
          ],
        },
      }
    );
    res.send("add new zone");
  });

  app.post("/cli-main/delete-zone", (req, res) => {
    Users.collection(DBMS.ClientDeviceControl).updateOne(
      {
        OwnerID: req.user.id,
        GPSID: req.body.GPSID,
      },
      {
        $pull: {
          Data: [
            parseInt(req.body.Radius),
            parseFloat(req.body.Long),
            parseFloat(req.body.Lat),
          ],
        },
      }
    );
    res.send("zone deleted");
  });

  app.post("/cli-main/get-zone-information", (req, res) => {
    Users.collection(DBMS.ClientDeviceControl)
      .find({
        OwnerID: req.user.id,
        GPSID: req.body.GPSID,
      })
      .toArray(function (err, response) {
        res.send(response);
      });
  });
};
