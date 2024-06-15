import { body, validationResult } from "express-validator";
import { getNavData, getAddCategoryForm, getAddItemForm } from "./index.js";
import invModel from "../models/inventory-model.js";
const classificationIdIsDupe = invModel.classificationIdIsDupe;
const categoryIsDupe = invModel.categoryIsDupe;

const categoryRules = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Category name is required")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Category name must be alphanumeric")
    .custom(async (categoryName) => {
      const categoryExists = await categoryIsDupe(categoryName);
      if (categoryExists) {
        throw new Error("Category already exists");
      }
    }),
];

const checkCategoryData = async (req, res, next) => {
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    errorResult.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    res.render("pages/inventory/add-category", {
      title: "Add Vehicle Category",
      navData: await getNavData(),
      formConfig: getAddCategoryForm(req.body.name),
    });
    return;
  } else {
    next();
  }
};

const itemRules = [
  body("classificationId")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("classificationId is required")
    .custom(async (classificationId) => {
      const categoryExists = await classificationIdIsDupe(classificationId);
      if (!categoryExists) {
        throw new Error("classificationId doesn't exist");
      }
    })
    .withMessage("classificationId doesn't exist"),
  body("make").trim().escape().notEmpty().withMessage("Make is required."),
  body("model").trim().escape().notEmpty().withMessage("Model is required."),
  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description is required."),
  body("imagePath")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Image path is required."),
  body("thumbnailPath")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Thumbnail path is required."),
  body("price")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric({ min: 0 })
    .withMessage("Price is required and must be a number"),
  body("year")
    .trim()
    .escape()
    .notEmpty()
    .matches(/^[0-9]{4}$/)
    .withMessage("Year is required and must a valid 4-digit year"),
  body("mileage")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric({ min: 0 })
    .withMessage("Mileage is required and must be a number"),
  body("color").trim().escape().notEmpty().withMessage("Color is required."),
];

const checkItemData = async (req, res, next) => {
  const errorResult = validationResult(req);
  if (!errorResult.isEmpty()) {
    errorResult.array().forEach((error) => {
      console.log("item validation error: ", error);
      req.flash("error", `${error.path}: ${error.msg}`);
    });
    res.render("pages/inventory/add-item", {
      title: "Add Vehicle Item",
      navData: await getNavData(),
      formConfig: await getAddItemForm({ ...req.body }),
    });
    return;
  } else {
    next();
  }
};

export { categoryRules, checkCategoryData, itemRules, checkItemData };
