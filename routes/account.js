import { Router } from "express";
import {
  getLoginPage,
  performLogin,
  getRegistrationPage,
  registerAccount,
  renderAccountPage,
  performLogout,
  getEditAccountPage,
  performAccountUpdate,
  performPasswordUpdate,
} from "../controllers/account.js";
import {
  registrationRules,
  checkRegistrationData,
  loginRules,
  checkLoginData,
  updateDetailsRules,
  checkUpdateDetailsData,
  updatePasswordRules,
  checkUpdatePasswordData,
} from "../utils/account-validation.js";
import { validateProtectedRoute } from "../utils/auth.js";

const router = Router();

router.get("/", validateProtectedRoute, renderAccountPage);
router.get("/login", getLoginPage);
router.post("/login", loginRules, checkLoginData, performLogin);
router.get("/logout", performLogout);
router.get("/register", getRegistrationPage);
router.post(
  "/register",
  registrationRules,
  checkRegistrationData,
  registerAccount
);
router.get("/edit-account", validateProtectedRoute, getEditAccountPage);

router.post(
  "/update-details/:accountId",
  validateProtectedRoute,
  updateDetailsRules,
  checkUpdateDetailsData,
  performAccountUpdate
);
router.post(
  "/update-password/:accountId",
  validateProtectedRoute,
  updatePasswordRules,
  checkUpdatePasswordData,
  performPasswordUpdate
);

export default router;
