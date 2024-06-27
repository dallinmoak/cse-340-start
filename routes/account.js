import { Router } from "express";
import {
  getLoginPage,
  performLogin,
  getRegistrationPage,
  registerAccount,
  renderAccountPage,
} from "../controllers/account.js";
import {
  registrationRules,
  checkRegistrationData,
  loginRules,
  checkLoginData,
} from "../utils/account-validation.js";
import { validateProtectedRoute } from "../utils/auth.js";

const router = Router();

router.get("/", validateProtectedRoute, renderAccountPage);
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
