import { Router } from "express";
import { addReview } from "../controllers/review.js";
import invController from "../controllers/inventory.js";
const { buildItemViewFromBadReviewVal } = invController;
import { authorizeByRoles } from "../utils/auth.js";
import { validateNewReview } from "../utils/review-validation.js";

const router = Router();

const authorizeClient = (req, res, next) =>
  authorizeByRoles(["Client"], { req, res, next });

const verifyReviewRequest = (h) => {
  return [
    authorizeClient,
    validateNewReview.rules,
    (req, res, next) => validateNewReview.validator(req, res, next, h),
  ];
};

router.post(
  "/:productId",
  ...verifyReviewRequest(buildItemViewFromBadReviewVal),
  addReview
);
router.post(
  "/edit/:reviewId",
  ...verifyReviewRequest((req, res, next) => {
    res.send("error");
  }),
  (req, res, next) => {
    res.send("Updated review");
  }
);

export default router;
