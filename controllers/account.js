import { createAccount } from "../models/account-model.js";
import {
  getNavData,
  getLoginForm,
  getRegistrationForm,
} from "../utils/index.js";
import { vehicle } from "../utils/homePageVehicle.js";

const getLoginPage = async (req, res) => {
  const navData = await getNavData();
  res.render("pages/account/login", {
    title: "Login",
    navData,
    formConfig: getLoginForm(),
  });
};

const performLogin = async (req, res, next) => {
  req.flash("success", "Login successful");
  res.render("pages/home", {
    title: "Home",
    navData: await getNavData(),
    vehicle,
  });
};

const getRegistrationPage = async (req, res) => {
  const navData = await getNavData();
  res.render("pages/account/register", {
    title: "Register",
    navData,
    formConfig: getRegistrationForm(),
  });
};

const registerAccount = async (req, res, next) => {
  try {
    const newAccount = await createAccount(req.body);
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
};

export { getLoginPage, getRegistrationPage, registerAccount, performLogin };
