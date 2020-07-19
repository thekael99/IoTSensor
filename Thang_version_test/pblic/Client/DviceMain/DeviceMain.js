// Generate origin element
let countTime = 0;
let IpLong = document.getElementById("logitude");
let IpLat = document.getElementById("latitude");
var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var labelIndex = 0;
let map;
let circle;
let circles = [];
let markers = new Map();
let lastEditingCircle = null;

// Get origin data, set to orign element
$.ajax({
  url: "/cli-main/get-gps-information",
  type: "POST",
}).done((result) => {
  var marker;
  $("#zone-panel").hide();
  $("#lat-lng-rad").hide();

  //default map view
  initMap(30, 30, 2);

  //Create a list of gps devices
  result.forEach((device) => {
    //create marker for that gps
    marker = new google.maps.Marker({
      position: {
        lat: parseFloat(device.DeviceData.Latitude),
        lng: parseFloat(device.DeviceData.Longitude),
      },
      label: labels[labelIndex++ % labels.length],
      map,
      // icon:'../Client/DviceMain/gps64.png'
    });
    markers.set(device._id, marker);

    $("#device-buttons-container").append(
      $(
        " <button id='" +
          device._id +
          "' class='btn btn-outline-secondary ml-2 mb-2 force-overflow' type='button' id='button-addon2'>GPS " +
          marker.getLabel() +
          "</button>"
      ).on("click", function () {
        $("edit-btn").trigger("click");
        $("#zone-panel").hide();
        $("#lat-lng-rad").hide();
        $("input.input-new-lat-lng-rad").val("");

        // toggle buttons
        $("#device-buttons-container").off("click");
        $("#device-buttons-container").on("click", ".btn", () => {
          $(this).addClass("active").siblings().removeClass("active");
        });

        //focus map
        // initMap(device.DeviceData.Latitude, device.DeviceData.Longitude, 5);
        map.panTo({
          lat: device.DeviceData.Latitude,
          lng: device.DeviceData.Longitude,
        });
        map.setZoom(5);

        $("#edit-btn-container").empty();
        $("#edit-btn-container").append(
          $(
            " <button class='btn btn-outline-secondary align-middle btn-block' type='button' id='edit-btn'>Edit</button>"
          ).on("click", function () {
            $("#lat-lng-rad").hide();
            lastEditingCircle = null;

            $("#input-info").show("fade");
            $("#input-info")
              .fadeTo(10000, 500)
              .slideUp(500, () => {
                $("#input-info").slideUp(500);
                $("#input-info").hide("fade");
              });

            //get safe Zone
            $.ajax({
              url: "/cli-main/get-zone-information",
              type: "POST",
              data: {
                GPSID: device._id,
              },
            }).done((zones) => {
              j = 1;
              $(".zone-buttons-container").empty();
              $("#zone-panel").show();

              circles.forEach((circle) => {
                circle.setMap(null);
              });
              circles = [];

              zones[0].Data.forEach((zone) => {
                circle = new google.maps.Circle({
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35,
                  map,
                  center: {
                    lat: zone[2],
                    lng: zone[1],
                  },
                  radius: zone[0],
                });
                circles.push(circle);
                $(".zone-buttons-container").append(
                  $(
                    " <button class='btn btn-outline-secondary mb-2' type='button' id='" +
                      zones[0].Data.indexOf(zone) +
                      "'>Zone " +
                      j +
                      "</button>"
                  ).on("click", function () {
                    //Reset circle
                    circles[zones[0].Data.indexOf(zone)].setCenter({
                      lat: zone[2],
                      lng: zone[1],
                    });
                    circles[zones[0].Data.indexOf(zone)].setRadius(zone[0]);

                    // toggle buttons
                    $(".zone-buttons-container").off("click");
                    $(".zone-buttons-container").on("click", ".btn", () => {
                      $(this)
                        .addClass("active")
                        .siblings()
                        .removeClass("active");
                    });

                    $("#lat-lng-rad").show();
                    /**/
                    $(".input-lat-lng-rad").off("change keyup blur");
                    $("#update-btn").off("click");

                    //focus map and default
                    mapFocus(circles[zones[0].Data.indexOf(zone)]);

                    $("#logitude").val(
                      circles[zones[0].Data.indexOf(zone)].getCenter().lng()
                    );
                    $("#latitude").val(
                      circles[zones[0].Data.indexOf(zone)].getCenter().lat()
                    );
                    $("#radius").val(
                      circles[zones[0].Data.indexOf(zone)].getRadius()
                    );

                    //Input direct to the form
                    $(".input-lat-lng-rad").on("change keyup blur", function (
                      event
                    ) {
                      // //only allow numeric
                      if (!inputValidate(this)) {
                        $("#update-btn").attr("disabled", true);
                        $("#update-btn").addClass("disable-cursor");

                        $("#input-alert").show("fade");
                        $("#close-input-alert").on("click", function () {
                          $("#input-alert").hide("fade");
                        });
                      } else {
                        $("#update-btn").attr("disabled", false);
                        $("#update-btn").removeClass("disable-cursor");
                        $("#input-alert").hide("fade");

                        //click outside to preview circles
                        $(".container-fluid").on("click", function (e) {
                          if (
                            !$(".input-lat-lng-rad").is(e.target) &&
                            $(".input-lat-lng-rad").has(e.target).length === 0
                          ) {
                            circles[zones[0].Data.indexOf(zone)].setCenter({
                              lat:
                                $("#latitude").val() === ""
                                  ? circles[zones[0].Data.indexOf(zone)]
                                      .getCenter()
                                      .lat()
                                  : parseFloat($("#latitude").val()),

                              lng:
                                $("#logitude").val() === ""
                                  ? circles[zones[0].Data.indexOf(zone)]
                                      .getCenter()
                                      .lng()
                                  : parseFloat($("#logitude").val()),
                            });
                            circles[zones[0].Data.indexOf(zone)].setRadius(
                              $("#radius").val() === ""
                                ? circles[
                                    zones[0].Data.indexOf(zone)
                                  ].getRadius()
                                : parseFloat($("#radius").val())
                            );
                            mapFocus(circles[zones[0].Data.indexOf(zone)]);
                            $(".container-fluid").off("click");
                            // google.maps.event.trigger(circles[zones[0].Data.indexOf(zone)], "dblclick");
                          }
                        });
                      }
                    });

                    //
                    $("#confirm-update").off("click");
                    $("#confirm-update").on("click", () => {
                      // Update gps coordinates, realtime response with socket
                      $.ajax({
                        url: "/cli-main/update-zone-latLngRad",
                        type: "POST",
                        data: {
                          OwnerID: zone.OwnerID,
                          GPSID: zones[0].GPSID,
                          Long: IpLong.value === "" ? zone[1] : IpLong.value,
                          Lat: IpLat.value === "" ? zone[2] : IpLat.value,
                          Radius:
                            $("#radius").val() === ""
                              ? zone[0]
                              : $("#radius").val(),
                          index: zones[0].Data.indexOf(zone),
                        },
                      }).done((res) => {
                        //console.log(res);

                        $("#my-success").show("fade");
                        $("#my-success")
                          .fadeTo(2000, 500)
                          .slideUp(500, () => {
                            $("my-succuess").slideUp(500);
                            $("#my-success").hide("fade");
                          });

                        $("#edit-btn").trigger("click");
                      });
                    });

                    //
                    $("#confirm-delete").off("click");
                    $("#confirm-delete").on("click", () => {
                      // delete zone
                      $.ajax({
                        type: "POST",
                        url: "/cli-main/delete-zone",
                        data: {
                          GPSID: zones[0].GPSID,
                          Radius: zone[0],
                          Long: zone[1],
                          Lat: zone[2],
                        },
                      }).done((res) => {
                        circles[zones[0].Data.indexOf(zone)].setMap(null);
                        $("#edit-btn").trigger("click");

                        $("#my-success").show("fade");
                        $("#my-success")
                          .fadeTo(2000, 500)
                          .slideUp(500, () => {
                            $("my-succuess").slideUp(500);
                            $("#my-success").hide("fade");
                          });
                        //console.log(res);
                      });
                    });
                  })
                );

                //Or change via editting the circles
                google.maps.event.addListener(
                  circles[zones[0].Data.indexOf(zone)],
                  "dblclick",
                  function (event) {
                    let onMapclick;

                    if (lastEditingCircle)
                      resetCircle(circles, lastEditingCircle, zones);
                    lastEditingCircle = zone;

                    $("#" + zones[0].Data.indexOf(zone)).trigger("click");

                    if (event) event.stop();

                    //circles become editable
                    circles[zones[0].Data.indexOf(zone)].setEditable(true);
                    mapFocus(circles[zones[0].Data.indexOf(zone)]);

                    //show warning if lat, lng or rad is empty

                    //change circles center listener
                    google.maps.event.addListener(
                      circles[zones[0].Data.indexOf(zone)],
                      "center_changed",
                      function (event) {
                        $("#logitude").val(
                          circles[zones[0].Data.indexOf(zone)].getCenter().lng()
                        );
                        $("#latitude").val(
                          circles[zones[0].Data.indexOf(zone)].getCenter().lat()
                        );
                      }
                    );

                    //change circles radius listener
                    google.maps.event.addListener(
                      circles[zones[0].Data.indexOf(zone)],
                      "radius_changed",
                      function (event) {
                        $("#radius").val(
                          circles[zones[0].Data.indexOf(zone)].getRadius()
                        );
                      }
                    );

                    onMapclick = google.maps.event.addListener(
                      map,
                      "click",
                      function (event) {
                        google.maps.event.removeListener(onMapclick);
                        $("#panel").off("click");
                        circles[zones[0].Data.indexOf(zone)].setEditable(false);

                        google.maps.event.clearListeners(
                          circles[zones[0].Data.indexOf(zone)],
                          "center_changed"
                        );

                        google.maps.event.clearListeners(
                          circles[zones[0].Data.indexOf(zone)],
                          "radius_changed"
                        );
                      }
                    );

                    $("#panel").on("click", () => {
                      google.maps.event.removeListener(onMapclick);
                      circles[zones[0].Data.indexOf(zone)].setEditable(false);
                      $("#panel").off("click");
                    });
                    //
                    //
                  }
                );

                j++;
              });
            });

            $(".input-new-lat-lng-rad").off("change keyup");
            $(".input-new-lat-lng-rad").on("change keyup", function (event) {
              // //only allow numeric
              if (
                !inputValidate(this) &&
                ($("#new-lat").val() !== "" ||
                  $("#new-lng").val() !== "" ||
                  $("#new-rad").val() !== "")
              ) {
                $("#add-new-zone-btn").attr("disabled", true);
                $("#add-new-zone-btn").addClass("disable-cursor");

                $("#input-alert").show("fade");
                $("#close-input-alert").on("click", function () {
                  $("#input-alert").hide("fade");
                });
              } else {
                $("#add-new-zone-btn").attr("disabled", false);
                $("#add-new-zone-btn").removeClass("disable-cursor");
                $("#input-alert").hide("fade");
                $("#my-alert").hide("fade");
              }
            });

            //
            $("#add-new-zone-btn").off("click");
            $("#add-new-zone-btn").on("click", () => {
              if (
                // alert
                $("#new-lat").val() === "" ||
                $("#new-lng").val() === "" ||
                $("#new-rad").val() === ""
              ) {
                $("#add-new-zone-btn").removeAttr("data-toggle");
                $("#add-new-zone-btn").removeAttr("data-target");

                $("#my-alert").show("fade");
                $("#close-alert").on("click", function () {
                  $("#my-alert").hide("fade");
                });
              } else {
                $("#add-new-zone-btn").attr("data-toggle", "modal");
                $("#add-new-zone-btn").attr(
                  "data-target",
                  "#confirm-add-zone-box"
                );

                //add zone
                $("#confirm-add").off("click");
                $("#confirm-add").on("click", () => {
                  $.ajax({
                    url: "/cli-main/add-new-zone",
                    type: "POST",
                    data: {
                      GPSID: device._id,
                      Lat: $("#new-lat").val(),
                      Long: $("#new-lng").val(),
                      Radius: $("#new-rad").val(),
                    },
                  }).done((res) => {
                    //console.log(res);
                    $("#new-lat").val("");
                    $("#new-lng").val("");
                    $("#new-rad").val("");

                    $("#edit-btn").trigger("click");

                    // success
                    $("#my-alert").hide("fade");
                    $("#my-success").show("fade");
                    $("#my-success")
                      .fadeTo(2000, 500)
                      .slideUp(500, () => {
                        $("my-succuess").slideUp(500);
                        $("#my-success").hide("fade");
                      });
                  });
                });
              }
            });
          })
        );
      })
    );
    google.maps.event.clearListeners(marker, "click");
    google.maps.event.addListener(marker, "click", () => {
      $("#" + device._id).trigger("click");
    });
  });
});

$("#start-add-zone-btn").off("click");
$("#start-add-zone-btn").on("click", () => {
  map.setOptions({
    draggableCursor:
      "url(../Client/DviceMain/iconfinder30.png) 15 15, crosshair",
  });
  mouseMove = map.addListener("mousemove", (e) => {
    $("#new-lat").val(e.latLng.lat());
    $("#new-lng").val(e.latLng.lng());
  });
  map.addListener("click", () => {
    // google.maps.event.removeListener(mouseMove)
    google.maps.event.clearListeners(map, "mousemove");
    google.maps.event.clearListeners(map, "click");
    map.setOptions({
      draggableCursor: null,
    });
  });
});

function btnToggle(btn) {
  $(btn).addClass("active-btn");
  $(btn).siblings().removeClass("active-btn");
}

function mapFocus(circle) {
  map.panTo(circle.getCenter());
  map.setZoom(22 - Math.log(circle.getRadius() / 12.4) / Math.log(2));
}

//function create map
function initMap(lat, lng, zoom) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    },
    zoom,
  });
}

function inputValidate(input) {
  var pattern = /[+-]?([0-9]*[.])?[0-9]+/;
  match = $(input).val().match(pattern);
  return match && $(input).val() === match[0];
}

function resetCircle(circles, zone, zones) {
  circles[zones[0].Data.indexOf(zone)].setCenter({
    lat: zone[2],
    lng: zone[1],
  });
  circles[zones[0].Data.indexOf(zone)].setRadius(zone[0]);
}

// Initial  socket connection (real time connection)
const socket = io.connect("http://localhost:5000");
// const socket = io.connect(window.location.hostname);
// const socket = io.connect('https://getdateset.herokuapp.com')

// Sign socket with user id, and remove it in client-view
document.addEventListener("DOMContentLoaded", function () {
  socket.emit(
    "sign-in-socket",
    document.getElementById("user-id-socket").textContent
  );
  document.getElementById("user-id-socket").remove();
});

// Whenever MQTT get new DBMS, if It going to be changed,
//  emit to user socket online
socket.on("emit-new-gps", (data) => {
  //  data.gpsID; ID of GPS, user for determine what is the GPS change
  var lbl = markers.get(data.gpsID).getLabel();
  markers.get(data.gpsID).setMap(null);
  marker = new google.maps.Marker({
    position: {
      lat: data.data[1],
      lng: data.data[0],
    },
    label: lbl,
    map,
    // icon:'../Client/DviceMain/gps64.png'
  });
  markers.set(data.gpsID, marker);
});

// Whenever data change, MQTT, User change, ...,
// Server response to client new status of device
socket.on("update-status-GPS", (data) => {
  // id: ID of GPS, string type
  //State.textContent = data.status;
});
