import utils from "../utils/index.js";

const buildByClassificationId = async (req, res, next) => {
  const classification_id = req.params.classificationId;
  const navData = await utils.getNavData();
  res.render("pages/inventory/classification", {
    title: classification_id,
    navData,
    classification: {
      id: classification_id,
    },
  });
};

export default { buildByClassificationId };
