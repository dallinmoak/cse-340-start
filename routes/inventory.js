import { Router } from "express";
import inventoryController from "../controllers/inventory.js";

const router = Router();

router.get(
  "/type/:classificationId",
  inventoryController.buildByClassificationId
);

export default router;
