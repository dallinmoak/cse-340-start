import pool from "../database/index.js";

const getClassifications = async () => {
  const queryText =
    "SELECT * from course_340.classification ORDER BY classification_id";
  const data = await pool.query(queryText);
  return data;
};

const getInventoryByClassificationId = async (classificationId) => {
  const queryText =
    "SELECT * from course_340.inventory as i JOIN course_340.classification as c ON i.classification_id = c.classification_id WHERE c.classification_id = $1";
  try {
    const data = await pool.query(queryText, [classificationId]);
    return data.rows;
  } catch (e) {
    console.error(e);
  }
};

export default { getClassifications, getInventoryByClassificationId };
