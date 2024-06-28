import { Router } from "express";
import controller from "../controllers/inventory.js";

const router = Router();

router.get(
  "/inventory/type/:classificationId",
  controller.apiGetInventoryRecordsByType
);

export default router;
