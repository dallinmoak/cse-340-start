import { vehicle } from "../utils/homePageVehicle.js";
import { getPageData } from "../utils/index.js";

const buildHome = async (req, res) => {
  const pageData = await getPageData(req, res);
  res.render("pages/home", {
    title: "Home",
    vehicle,
    pageData,
  });
};

export default { buildHome };
