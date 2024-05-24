import pool from "../database/index.js";

const getClassifications = async () => {
  const queryText =
    "SELECT * from course_340.classification ORDER BY classification_id";
  const data = await pool.query(queryText);
  return data;
};

export default { getClassifications };
