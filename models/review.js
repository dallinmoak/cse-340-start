import pool from "../database/index.js";

const createReview = async (id, authorId, review) => {
  try {
    const queryText = `insert into course_340.review (inv_id, author_id, text) values ($1, $2, $3) returning *`;
    const res = await pool.query(queryText, [id, authorId, review]);
    return res.rows[0];
  } catch (e) {
    throw new Error(e.message);
  }
};

const getReviewsByAuthor = async (authorId) => {
  try {
    const queryText = `select r.review_id as id, r.text, r.date, i.inv_id as inv_id, i.inv_make, i.inv_model, i.inv_year, a.account_id as author_id, a.account_firstname as author_firstName, a.account_lastname as author_lastName from course_340.review as r join course_340.inventory as i on r.inv_id = i.inv_id join course_340.account as a on r.author_id = a.account_id where r.author_id = $1`;
    const res = await pool.query(queryText, [authorId]);
    if (res) {
      return res.rows.map((row) => {
        return {
          id: row.id,
          text: row.text,
          date: row.date,
          item: {
            id: row.inv_id,
            make: row.inv_make,
            model: row.inv_model,
            year: row.inv_year,
          },
          author: {
            id: row.author_id,
            firstName: row.author_firstname,
            lastName: row.author_lastname,
          },
        };
      });
    } else {
      throw new Error("res was falsy");
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const getReviewById = async (reviewId) => {
  try {
    const queryText = `select r.review_id as id, r.text, r.date, i.inv_id as inv_id, i.inv_make, i.inv_model, i.inv_year, a.account_id as author_id, a.account_firstname as author_firstName, a.account_lastname as author_lastName from course_340.review as r join course_340.inventory as i on r.inv_id = i.inv_id join course_340.account as a on r.author_id = a.account_id where r.review_id = $1`;
    const res = await pool.query(queryText, [reviewId]);
    return {
      id: res.rows[0].id,
      text: res.rows[0].text,
      date: res.rows[0].date,
      item: {
        id: res.rows[0].inv_id,
        make: res.rows[0].inv_make,
        model: res.rows[0].inv_model,
        year: res.rows[0].inv_year,
      },
      author: {
        id: res.rows[0].author_id,
        firstName: res.rows[0].author_firstname,
        lastName: res.rows[0].author_lastname,
      },
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateReviewbyId = async (reviewId, review) => {
  try {
    const queryText = `update course_340.review set text = $1, date= $3 where review_id = $2 returning *`;
    const res = await pool.query(queryText, [
      review,
      reviewId,
      new Date().toISOString(),
    ]);
    return res.rows[0];
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteReviewById = async (reviewId) => {
  try {
    const queryText =
      "delete from course_340.review where review_id = $1 returning *";
    const res = await query(queryText, [reviewId]);
    return res.rows[0];
  } catch (e) {
    throw new Error(e.message);
  }
};

export {
  createReview,
  getReviewsByAuthor,
  getReviewById,
  updateReviewbyId,
  deleteReviewById,
};
