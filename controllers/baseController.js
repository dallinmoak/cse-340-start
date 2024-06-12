import { vehicle } from "../utils/homePageVehicle.js";
import { getNavData } from "../utils/index.js";

const buildHome = async (req, res) => {
  const navData = await getNavData();
  res.render("pages/home", {
    title: "Home",
    vehicle,
    navData,
  });
};

export default { buildHome };
