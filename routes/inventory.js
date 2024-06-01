import { Router } from "express";
import invC from "../controllers/inventory.js";

const router = Router();

router.get("/type/:classificationId", invC.buildByClassificationId);
router.get("/item/:itemId", invC.builByInventoryId);

export default router;
