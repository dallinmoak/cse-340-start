import pool from "../database/index.js";
const { query } = pool;

const saveReview = async (id, authorId, review) => {
  try {
    const queryText = `insert into course_340.review (inv_id, author_id, text) values ($1, $2, $3) returning *`;
    const res = await query(queryText, [id, authorId, review]);
    return res.rows[0];
  } catch (e) {
    throw new Error(e.message);
  }
};

export { saveReview };
