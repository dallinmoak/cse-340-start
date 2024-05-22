import { Router } from "express";
import vController from "../controllers/vehicles.js";

const router = Router();

router.use("/", vController.getVehicle);

export default router;
