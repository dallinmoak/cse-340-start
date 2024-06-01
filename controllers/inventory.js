import { getNavData } from "../utils/index.js";
import inventoryModel from "../models/inventory-model.js";

const buildByClassificationId = async (req, res, next) => {
  const classification_id = req.params.classificationId;
  try {
    const invData = await inventoryModel.getInventoryByClassificationId(
      classification_id
    );
    if (!invData || invData.length === 0) {
      return next({
        status: 404,
        message: `classification id "${classification_id}" not found`,
      });
    }
    const navData = await getNavData();
    res.render("pages/inventory/classification", {
      title: invData[0].classification_name,
      navData,
      classification: {
        id: classification_id,
        name: invData[0].classification_name,
      },
      invList: invData,
    });
  } catch (e) {
    return next({
      status: 500,
      message: `error retrieving inventory data: ${e.message}`,
    });
  }
};

export default { buildByClassificationId };