import { Router } from "express";
import {
  getLoginPage,
  performLogin,
  getRegistrationPage,
  registerAccount,
} from "../controllers/account.js";
import {
  registrationRules,
  checkRegistrationData,
  loginRules,
  checkLoginData,
} from "../utils/account-validation.js";

const router = Router();

router.get("/login", getLoginPage);
router.post("/login", loginRules, checkLoginData, performLogin);
router.get("/register", getRegistrationPage);
router.post(
  "/register",
  registrationRules,
  checkRegistrationData,
  registerAccount
);

export default router;
