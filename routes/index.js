const router = require("express").Router();
const getVehicle = require("../controllers/vehicles");

router.use("/", getVehicle);

module.exports = router;
