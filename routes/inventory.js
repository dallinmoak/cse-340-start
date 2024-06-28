import { Router } from "express";
import invC from "../controllers/inventory.js";
import {
  categoryRules,
  checkCategoryData,
  itemRules,
  checkItemData,
} from "../utils/inv-validation.js";
import { authorizeByRoles } from "../utils/auth.js";

const router = Router();

router.get(
  "/",
  (req, res, next) =>
    authorizeByRoles(["Admin", "Employee"], { req, res, next }),
  invC.buildAdminView
);
router.get("/type/:classificationId", invC.buildByClassificationId);
router.get("/item/:itemId", invC.builByInventoryId);
router.get("/add-category", invC.buildAddCategoryView);
router.post(
  "/add-category",
  categoryRules,
  checkCategoryData,
  invC.addCategory
);
router.get("/edit/:itemId", invC.getEditForm);
router.post("/edit/:itemId", itemRules, checkItemData, invC.editItem);
router.get("/add-item", invC.buildAddItemView);
router.post("/add-item", itemRules, checkItemData, invC.addItem);

export default router;
