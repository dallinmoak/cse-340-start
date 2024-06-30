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

const authorizeAdminOrEmployee = (req, res, next) =>
  authorizeByRoles(["Admin", "Employee"], { req, res, next });

router.get("/", authorizeAdminOrEmployee, invC.buildAdminView);
router.get("/type/:classificationId", invC.buildByClassificationId);
router.get("/item/:itemId", invC.builByInventoryId);
router.get("/add-category", invC.buildAddCategoryView);
router.post(
  "/add-category",
  categoryRules,
  checkCategoryData,
  invC.addCategory
);
router.get("/edit/:itemId", authorizeAdminOrEmployee, invC.getEditForm);
router.post(
  "/edit/:itemId",
  authorizeAdminOrEmployee,
  itemRules,
  checkItemData,
  invC.editItem
);
router.get("/delete/:itemId", authorizeAdminOrEmployee, invC.getDeleteForm);
router.post("/delete/:itemId", authorizeAdminOrEmployee, invC.performDelete);
router.get("/add-item", invC.buildAddItemView);
router.post("/add-item", itemRules, checkItemData, invC.addItem);

export default router;
