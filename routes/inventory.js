import { Router } from "express";
import inventoryController from "../controllers/inventory.js";

const router = Router();

router.get(
  "/type/:classificationId",
  inventoryController.buildByClassificationId
);
router.get("/item/:itemId", (req, res, next) => {
  res.render("pages/inventory/item", {
    title: "Item Detail",
    navData: [],
    invItem: {
      id: 1,
      name: "Item Name",
      description: "Item Description",
      price: 100.0,
    },
  });
});

export default router;
