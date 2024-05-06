const vehicles = require("../models/vehicles");

const getVehicle = (req, res) => {
  const query = req.query;
  const reqVehicle = query.vehicle;
  const id = reqVehicle ? reqVehicle : "delorean";
  const vehicle = vehicles.find((v) => v.id == id);
  if (vehicle) {
    res.render("pages/home", {
      title: "Home",
      vehicle,
    });
  } else {
    res.send(404, "Vehicle not found");
  }
};

module.exports = getVehicle;
