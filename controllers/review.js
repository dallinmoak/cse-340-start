import {
  createReview,
  deleteReviewById,
  updateReviewbyId,
} from "../models/review.js";

const addReview = async (req, res, next) => {
  try {
    const newReview = await createReview(
      req.params.productId,
      req.query.authorId,
      req.body.review
    );
    req.flash("success", `review added: ${JSON.stringify(newReview)}`);
    res.redirect(`/inv/item/${req.params.productId}`);
  } catch (e) {
    return next({
      status: 500,
      message: `error adding review: ${e.message}`,
    });
  }
};

const editReview = async (req, res, next) => {
  try {
    const editedReview = await updateReviewbyId(
      req.params.reviewId,
      req.body.review
    );
    req.flash("success", `The review has been updated.`);
    res.redirect(`/account`);
  } catch (e) {
    return next({
      status: 500,
      message: `error editing review: ${e.message}`,
    });
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const deletedReview = await deleteReviewById(req.params.reviewId);
    if (deletedReview && deletedReview.text) {
      const needsTrim = deletedReview.text.length > 30;
      const trimmedText = needsTrim
        ? `${deletedReview.text.substring(0, 30)}...`
        : deletedReview.text;

      req.flash(
        "success",
        `The review that said "${trimmedText}" has been deleted.`
      );
      res.redirect(`/account`);
    } else {
      next({
        status: 404,
        message: `Review with id ${req.params.reviewId} not found.`,
      });
    }
  } catch (e) {
    console.log(e);
    return next({
      status: 500,
      message: `error deleting review: ${e.message}`,
    });
  }
};

export { addReview, editReview, deleteReview };
