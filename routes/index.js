import { Router } from "express";
import inventoryRouter from "./inventory.js";
import baseController from "../controllers/baseController.js";

const router = Router();

router.get("/", baseController.buildHome);
router.use("/inv", inventoryRouter);
router.use(async (req, res, next) => {
  next({
    status: 404,
    message: `route "${req.path}" not found`,
  });
});
export default router;
