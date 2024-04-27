const reviews = require("./reviews");
const upgrades = require("./upgrades");

module.exports = [
  {
    id: "delorean",
    make: "DMC",
    model: "Delorean",
    image: "/images/vehicles/delorean.jpg",
    image_tn: "/images/vehicles/delorean-tn.jpg",
    features: ["3 Cup holders", "Superman doors", "Fuzzy dice!"],
    upgrades: upgrades["delorean"],
    reviews: reviews["delorean"],
  },
];
