import { body } from "express-validator";
const newReviewRules = [
  body("review")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ min: 3 })
    .withMessage("Review text must be at least 3 characters long"),
];

import { validationResult } from "express-validator";

export const validateNewReview = {
  rules: newReviewRules,
  validator: async (req, res, next, valErrorHandler) => {
    const checkResult = validationResult(req);
    if (!checkResult.isEmpty()) {
      checkResult.array().forEach((error) => {
        req.flash("error", error.msg);
      });
      valErrorHandler(req, res, next);
    } else {
      next();
    }
  },
};
