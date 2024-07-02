import invModel from "../models/inventory-model.js";
import "dotenv/config";
import { checkAuth } from "./auth.js";
import { getAccountById } from "../models/account-model.js";

import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "../database/index.js";

const { getClassifications } = invModel;
const getPageData = async (req, res) => {
  const data = await getClassifications();
  const dataFormatted = data.rows.map((row) => {
    return {
      id: row.classification_id,
      name: row.classification_name,
    };
  });
  let user = null;
  const authData = checkAuth(req, res);
  if (authData?.account_id) {
    user = await getAccountById(authData.account_id);
  }
  return {
    navData: dataFormatted,
    user,
  };
};

const handleErrors = (fn) => {
  const wrapper = (req, res, next) => {
    const fnResult = fn(req, res, next);
    const resolution = Promise.resolve(fnResult);
    return resolution.catch(next);
  };
  return wrapper;
};

const errorResponder = async (e, req, res, next) => {
  const pageData = await getPageData(req, res);
  console.error(`error at ${req.originalUrl}`, e);
  if (process.env.NODE_ENV != "development") {
    if (e.status != 404) {
      e.status = 500;
      e.message = `Server Error. Verbose output is disabled in ${process.env.NODE_ENV}.`;
    }
  }
  res.render("errors/error", {
    title: e.status || "Server Error",
    message: e.message,
    pageData,
  });
};

const pgConnector = connectPgSimple(session);
const pgStore = new pgConnector({
  createTableIfMissing: true,
  schemaName: "course_340",
  pool,
});
const pgSession = () => {
  const sessionOptions = {
    store: pgStore,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sid",
  };
  return session(sessionOptions);
};

const getLoginForm = (prefilledVals) => {
  const formData = [
    {
      name: "email",
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "enter a valid email",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "password",
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "enter a password",
      required: true,
      pattern:
        "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$",
      value: null,
    },
  ];
  if (prefilledVals) {
    formData.forEach((field) => {
      field.value = prefilledVals[field.name];
    });
  }
  return {
    formData,
    action: "/account/login",
    method: "POST",
    submitLabel: "Login",
  };
};

const getEditAccountForm = (prefilledVals) => {
  const formData = [
    {
      name: "firstName",
      id: "firstNameFirst Name",
      label: "First Name",
      type: "text",
      placeholder: "enter first name",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "lastName",
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "enter last name",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "email",
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "enter email",
      required: true,
      pattern: null,
      value: null,
    },
  ];
  if (prefilledVals) {
    formData.forEach((field) => {
      field.value = prefilledVals[field.name];
    });
  }
  return {
    formData,
    action: "/account/update-details",
    method: "POST",
    submitLabel: "Update Details",
  };
};

const getRegistrationForm = (prefilledVals) => {
  const formData = [
    {
      name: "firstName",
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "enter your first name",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "lastName",
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "enter your last name",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "email",
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "enter a valid email",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "password",
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "enter a password",
      required: true,
      pattern:
        "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$",
      value: null,
    },
  ];
  if (prefilledVals) {
    formData.forEach((field) => {
      field.value = prefilledVals[field.name];
    });
  }
  return {
    formData,
    action: "/account/register",
    method: "POST",
    submitLabel: "Register",
  };
};

const getAddCategoryForm = (prefilledVals) => {
  const formData = [
    {
      name: "name",
      id: "name",
      label: "Category Name",
      type: "text",
      placeholder: "name for the new category",
      required: true,
      pattern: "^\\s*[a-zA-Z0-9]+\\s*$",
      value: null,
    },
  ];
  if (prefilledVals) {
    formData.forEach((field) => {
      field.value = prefilledVals[field.name];
    });
  }
  return {
    formData,
    action: "/inv/add-category",
    method: "POST",
    submitLabel: "Add Category",
  };
};

const getAddItemForm = async (prefilledVals) => {
  const classificationOption = await invModel.getClassifications();
  const formData = [
    {
      name: "classificationId",
      id: "classificationId",
      label: "Classification",
      type: {
        select: true,
        options: classificationOption.rows.map((row) => {
          return {
            value: row.classification_id,
            label: row.classification_name,
          };
        }),
      },
      placeholder: "select a classification",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "make",
      id: "make",
      label: "Make",
      type: "text",
      placeholder: "vehicle make",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "model",
      id: "model",
      label: "Model",
      type: "text",
      placeholder: "vehicle model",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "description",
      id: "description",
      label: "Description",
      type: "textarea",
      placeholder: "vehicle description",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "imagePath",
      id: "imagePath",
      label: "Image Path",
      type: "text",
      placeholder: "path to vehicle image",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "thumbnailPath",
      id: "thumbnailPath",
      label: "Thumbnail Path",
      type: "text",
      placeholder: "path to vehicle thumbnail",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "price",
      id: "price",
      label: "Price",
      type: "number",
      placeholder: "vehicle price",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "year",
      id: "year",
      label: "Year",
      type: "text",
      placeholder: "vehicle year (4 digits)",
      required: true,
      pattern: "^[0-9]{4}$",
      value: null,
    },
    {
      name: "mileage",
      id: "mileage",
      label: "Mileage",
      type: "number",
      placeholder: "vehicle mileage",
      required: true,
      pattern: null,
      value: null,
    },
    {
      name: "color",
      id: "color",
      label: "Color",
      type: "text",
      placeholder: "vehicle color",
      required: true,
      pattern: null,
      value: null,
    },
  ];
  if (prefilledVals) {
    formData.forEach((field) => {
      field.value = prefilledVals[field.name];
    });
  }
  return {
    formData,
    action: "/inv/add-item",
    method: "POST",
    submitLabel: "Add Vehicle",
  };
};

const getUpdatePwForm = (prefilledVals) => {
  const formData = [
    {
      name: "password",
      id: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "enter a password",
      pattern:
        "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$",
      value: null,
    },
  ];
  if (prefilledVals) {
    formData.forEach((field) => {
      field.value = prefilledVals[field.name];
    });
  }
  return {
    formData,
    action: "/account/update-password",
    method: "POST",
    submitLabel: "Update Password",
  };
};

export {
  getPageData,
  handleErrors,
  errorResponder,
  pgSession,
  getLoginForm,
  getRegistrationForm,
  getAddCategoryForm,
  getAddItemForm,
  getEditAccountForm,
  getUpdatePwForm,
};
