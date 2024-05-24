import { Router } from "express";
import inventoryRouter from "./inventory.js";
import baseController from "../controllers/baseController.js";

const router = Router();

router.get("/", baseController.buildHome);
router.use("/inv", inventoryRouter);
export default router;
