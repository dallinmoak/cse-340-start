import { body, validationResult } from "express-validator";
import {
  getPageData,
  getRegistrationForm,
  getEditAccountForm,
  getLoginForm,
  getUpdatePwForm,
} from "./index.js";
import { emailIsDupe, getAccountByEmail } from "../models/account-model.js";

const flashValErrors = (req, errors) => {
  let paths = {};
  errors.array().forEach((error) => {
    if (!paths[error.path]) {
      paths[error.path] = [];
    }
    paths[error.path].push(error.msg);
  });
  Object.keys(paths).forEach((path) => {
    req.flash("error", `${path}: ${paths[path].join(", ")}`);
  });
};

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
    flashValErrors(req, errorResult);
    res.render("pages/account/register", {
      title: "Register",
      pageData: await getPageData(req, res),
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
    flashValErrors(req, errorResult);
    res.render("pages/account/login", {
      title: "Login",
      pageData: await getPageData(req, res),
      formConfig,
    });
    return;
  } else {
    next();
  }
};

const updateDetailsRules = [
  body("firstName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("first name is required")
    .isLength({ min: 1 })
    .withMessage("first name must have at least 1 character"),
  body("lastName")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("last name is required")
    .isLength({ min: 1 })
    .withMessage("last name must have at least 1 character"),
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid format")
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const matches = await getAccountByEmail(email);
      const filteredMatches = matches.filter(
        (match) => match.account_id != req.params.accountId
      );
      if (filteredMatches.length > 0) {
        throw new Error("Email is already in use");
      }
    })
    .withMessage("Email is already in use"),
];

const checkUpdateDetailsData = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    const prefils = { firstName, lastName, email };
    const formConfig = getEditAccountForm(prefils);
    const pwFormConfig = getUpdatePwForm();
    flashValErrors(req, errorResult);
    const pageData = await getPageData(req, res);
    res.render("pages/account/edit", {
      title: "Edit Account",
      pageData,
      formConfig: {
        ...formConfig,
        action: `/account/update-details/${pageData.user.account_id}`,
      },
      pwFormConfig: {
        ...pwFormConfig,
        action: `/account/update-password/${pageData.user.account_id}`,
      },
    });
    return;
  } else {
    next();
  }
};

const updatePasswordRules = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
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

const checkUpdatePasswordData = async (req, res, next) => {
  const { password } = req.body;
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    const pwPrefils = password ? { password } : null;
    const pwFormConfig = getUpdatePwForm(pwPrefils);
    flashValErrors(req, errorResult);
    const pageData = await getPageData(req, res);
    const prefils = {
      firstName: pageData.user.account_firstname,
      lastName: pageData.user.account_lastname,
      email: pageData.user.account_email,
    };
    const formConfig = getEditAccountForm(prefils);
    res.render("pages/account/edit", {
      title: "Edit Account",
      pageData,
      formConfig: {
        ...formConfig,
        action: `/account/update-details/${pageData.user.account_id}`,
      },
      pwFormConfig: {
        ...pwFormConfig,
        action: `/account/update-password/${pageData.user.account_id}`,
      },
    });
    return;
  } else {
    next();
  }
};

export {
  registrationRules,
  checkRegistrationData,
  loginRules,
  checkLoginData,
  updateDetailsRules,
  checkUpdateDetailsData,
  updatePasswordRules,
  checkUpdatePasswordData,
};
