import { Router } from "express";
import baseController from "../controllers/baseController.js";

const router = Router();

router.use("/", baseController.buildHome);

export default router;
