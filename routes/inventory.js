import { Router } from "express";
import invC from "../controllers/inventory.js";
import {
  categoryRules,
  checkCategoryData,
  itemRules,
  checkItemData,
} from "../utils/inv-validation.js";

const router = Router();

router.get("/", invC.buildAdminView);
router.get("/type/:classificationId", invC.buildByClassificationId);
router.get("/item/:itemId", invC.builByInventoryId);
router.get("/add-category", invC.buildAddCategoryView);
router.post(
  "/add-category",
  categoryRules,
  checkCategoryData,
  invC.addCategory
);
router.get("/add-item", invC.buildAddItemView);
router.post("/add-item", itemRules, checkItemData, invC.addItem);

export default router;
