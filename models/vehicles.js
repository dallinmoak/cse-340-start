import reviews from "./reviews.js";
import upgrades from "./upgrades.js";
export default [
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
