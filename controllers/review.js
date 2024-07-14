import { saveReview } from "../models/review.js";

const addReview = async (req, res, next) => {
  try {
    const newReview = await saveReview(
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

export { addReview };
