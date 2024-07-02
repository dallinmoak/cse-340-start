import {
  createAccount,
  getAccountByEmail,
  updateAccount,
  updateAccountPw,
} from "../models/account-model.js";
import {
  getPageData,
  getLoginForm,
  getRegistrationForm,
  getEditAccountForm,
  getUpdatePwForm,
} from "../utils/index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { setLoginCookie, validateloginPw } from "../utils/auth.js";

const getLoginPage = async (req, res) => {
  res.render("pages/account/login", {
    title: "Login",
    pageData: await getPageData(req, res),
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
    pageData: await getPageData(req, res),
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
    pageData: await getPageData(req, res),
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
        pageData: await getPageData(req, res),
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
    pageData: await getPageData(req, res),
  });
};

const performLogout = (req, res, next) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

const getEditAccountPage = async (req, res, next) => {
  const pageData = await getPageData(req, res);
  let formConfig = getEditAccountForm({
    firstName: pageData.user.account_firstname,
    lastName: pageData.user.account_lastname,
    email: pageData.user.account_email,
  });
  formConfig.action = `/account/update-details/${pageData.user.account_id}`;
  let pwFormConfig = getUpdatePwForm();
  pwFormConfig.action = `/account/update-password/${pageData.user.account_id}`;
  res.render("pages/account/edit", {
    title: "Edit Account",
    pageData,
    formConfig,
    pwFormConfig,
  });
};

const performAccountUpdate = async (req, res, next) => {
  try {
    const updatedAccount = await updateAccount({
      ...req.body,
      accountId: req.params.accountId,
    });
    if (!updatedAccount) {
      req.flash("error", "Account update failed");
      res.redirect("/account/edit-account");
    } else {
      res.clearCookie("jwt");
      setLoginCookie(res, { ...updatedAccount, account_password: undefined });
      req.flash("success", "Account updated successfully");
      res.redirect("/account");
    }
  } catch (e) {
    console.error(e);
    next({
      status: 500,
      message: e.message,
    });
  }
};

const performPasswordUpdate = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    try {
      const updatedAccount = await updateAccountPw({
        accountId: req.params.accountId,
        password: hash,
      });
      if (!updatedAccount) {
        req.flash("error", "Password update failed");
        res.redirect("/account/edit-account");
      } else {
        res.clearCookie("jwt");
        setLoginCookie(res, { ...updatedAccount, account_password: undefined });
        req.flash("success", "Password updated successfully");
        res.redirect("/account");
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

export {
  getLoginPage,
  getRegistrationPage,
  registerAccount,
  performLogin,
  renderAccountPage,
  performLogout,
  getEditAccountPage,
  performAccountUpdate,
  performPasswordUpdate,
};
