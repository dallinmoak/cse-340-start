import utils from "../utils/index.js";
import inventoryModel from "../models/inventory-model.js";

const buildByClassificationId = async (req, res, next) => {
  const classification_id = req.params.classificationId;
  const navData = await utils.getNavData();
  const invData = await inventoryModel.getInventoryByClassificationId(
    classification_id
  );
  res.render("pages/inventory/classification", {
    title: invData[0].classification_name,
    navData,
    classification: {
      id: classification_id,
      name: invData[0].classification_name,
    },
    invList: invData,
  });
};

export default { buildByClassificationId };
