import { body, validationResult } from "express-validator";
import { getNavData, getRegistrationForm } from "./index.js";
import { emailIsDupe } from "../models/account-model.js";
import { getLoginForm } from "./index.js";

const registrationRules = [
  body("firstName")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Last name is required"),
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required")
    .custom(async (email) => {
      const emailExists = await emailIsDupe(email);
      if (emailExists) {
        throw new Error("Email is already in use");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];
const checkRegistrationData = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    const prefils = { firstName, lastName, email };
    const formConfig = getRegistrationForm(prefils);
    console.log("prefils", prefils);
    console.log("formConfig", formConfig);
    errorResult.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    res.render("pages/account/register", {
      title: "Register",
      navData: await getNavData(),
      formConfig,
    });
    return;
  } else {
    next();
  }
};

const loginRules = [
  body("email")
    .trim()
    .escape()
    .notEmpty()
    // .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").trim().notEmpty(),
  // .isStrongPassword({
  //   minLength: 12,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  // })
  // .withMessage(
  //   "Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  // ),
];

const checkLoginData = async (req, res, next) => {
  const { email } = req.body;
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    const prefils = { email };
    const formConfig = getLoginForm(prefils);
    errorResult.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    res.render("pages/account/login", {
      title: "Login",
      navData: await getNavData(),
      formConfig,
    });
    return;
  } else {
    next();
  }
};

export { registrationRules, checkRegistrationData, loginRules, checkLoginData };
