import { Router } from "express";
import inventoryController from "../controllers/inventory.js";
import { getNavData } from "../utils/index.js";
import invModel from "../models/inventory-model.js";

const router = Router();

router.get(
  "/type/:classificationId",
  inventoryController.buildByClassificationId
);
router.get("/item/:itemId", async (req, res, next) => {
  const navData = await getNavData();
  const invItem = await invModel.getInventoryItemById(req.params.itemId);
  res.render("pages/inventory/item", {
    title: `${req.params.itemId} item`,
    navData,
    invItem,
  });
});

export default router;
