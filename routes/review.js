import { Router } from "express";
import { addReview } from "../controllers/review.js";
import { authorizeByRoles } from "../utils/auth.js";

import { body, validationResult } from "express-validator";
const newReviewFormRules = [
  body("review")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ min: 3 })
    .withMessage("Review text must be at least 3 characters long"),
];

import inventoryModel from "../models/inventory-model.js";
import { getPageData } from "../utils/index.js";
import { getReviewForm } from "../utils/index.js";
const checkReviewForm = async (req, res, next) => {
  const checkResult = validationResult(req);
  if (!checkResult.isEmpty()) {
    checkResult.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    try {
      const invItem = await inventoryModel.getInventoryItemById(
        req.params.productId
      );
      const pageData = await getPageData(req, res);
      const body = req.body;
      console.log("body", body);
      const reviewForm = getReviewForm(
        { review: req.body.review },
        invItem.inv_id,
        pageData.user?.account_id
      );
      console.log("reviewForm", reviewForm);
      res.render("pages/inventory/item", {
        title: `${invItem.inv_year} ${invItem.inv_make} ${invItem.inv_model}`,
        pageData,
        invItem,
        reviewForm,
        showForm: true,
      });
      return;
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    next();
  }
};

const router = Router();

const authorizeClient = (req, res, next) =>
  authorizeByRoles(["Client"], { req, res, next });

router.post(
  "/:productId",
  authorizeClient,
  newReviewFormRules,
  checkReviewForm,
  addReview
);

export default router;
