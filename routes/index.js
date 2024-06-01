import { Router } from "express";
import inventoryRouter from "./inventory.js";
import baseController from "../controllers/baseController.js";
import brokenController from "../controllers/brokenController.js";
import { handleErrors as h } from "../utils/index.js";

const router = Router();

router.get("/", h(baseController.buildHome));
router.use("/inv", h(inventoryRouter));
router.use("/broken", h(brokenController.buildBroken));
router.use(async (req, res, next) => {
  next({
    status: 404,
    message: `route "${req.path}" not found`,
  });
});
export default router;
