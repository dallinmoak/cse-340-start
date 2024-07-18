import { Router } from "express";
import { addReview, editReview, deleteReview } from "../controllers/review.js";
import invController from "../controllers/inventory.js";
const { buildItemViewFromBadReviewVal } = invController;
import { renderAccountPageFromBadReviewVal } from "../controllers/account.js";
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
  ...verifyReviewRequest(renderAccountPageFromBadReviewVal),
  editReview
);

router.get("/delete/:reviewId", authorizeClient, deleteReview);

export default router;
