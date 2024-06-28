import { createAccount, getAccountByEmail } from "../models/account-model.js";
import {
  getNavData,
  getLoginForm,
  getRegistrationForm,
} from "../utils/index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { setLoginCookie, validateloginPw } from "../utils/auth.js";

const getLoginPage = async (req, res) => {
  res.render("pages/account/login", {
    title: "Login",
    navData: await getNavData(),
    formConfig: getLoginForm(),
  });
};

const loginError = async (
  req,
  res,
  msg = "Invalid password",
  target = "login",
  title = "Login",
  formGetter = getLoginForm
) => {
  req.flash("error", msg);
  res.clearCookie("jwt");
  const prefils = { email: req.body.email };
  return res.render(`pages/account/${target}`, {
    title,
    navData: await getNavData(),
    formConfig: formGetter(prefils),
  });
};

const handleNoAccount = async (req, res) => {
  const params = [
    `Account for "${req.body.email}" not found. Try registering.`,
    "register",
    "Register",
    getRegistrationForm,
  ];
  return await loginError(req, res, ...params);
};

const performLogin = async (req, res, next) => {
  try {
    const accountResults = await getAccountByEmail(req.body.email);
    const account = accountResults[0];
    if (!account) {
      return await handleNoAccount(req, res);
    }
    try {
      const hashed = account.account_password;
      const passwordIsMatch = await validateloginPw(req, hashed);
      if (passwordIsMatch) {
        const accountSanitized = { ...account, account_password: undefined };
        setLoginCookie(res, accountSanitized);
        req.flash("success", "Login successful");
        res.redirect("/account");
      } else {
        return await loginError(req, res);
      }
    } catch (e) {
      console.error(e);
      next({
        status: 500,
        message: e.message,
      });
    }
  } catch (e) {
    console.error(e);
    next({
      status: 500,
      message: e.message,
    });
  }
};

const getRegistrationPage = async (req, res) => {
  res.render("pages/account/register", {
    title: "Register",
    navData: await getNavData(),
    formConfig: getRegistrationForm(),
  });
};

const registerAccount = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
      const newAccount = await createAccount({
        ...req.body,
        password: hashedPassword,
      });
      if (!newAccount?.rows) {
        req.flash("error", "Account creation failed");
        throw new Error(`Account creation failed: ${newAccount}`);
      }
      req.flash("success", "Account created successfully");
      res.status(201).render("pages/account/login", {
        title: "Login",
        navData: await getNavData(),
        formConfig: getLoginForm(),
      });
    } catch (e) {
      console.error(e);
      next({
        status: 500,
        message: e.message,
      });
    }
  } catch (e) {
    console.error(e);
    next({
      status: 500,
      message: e.message,
    });
  }
};

const renderAccountPage = async (req, res, next) => {
  res.render("pages/account/account", {
    title: "Account",
    navData: await getNavData(),
  });
};

export {
  getLoginPage,
  getRegistrationPage,
  registerAccount,
  performLogin,
  renderAccountPage,
};
