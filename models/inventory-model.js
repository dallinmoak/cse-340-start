import pool from "../database/index.js";

const getClassifications = async () => {
  const queryText =
    "SELECT * from course_340.classification ORDER BY classification_id";
  const data = await pool.query(queryText);
  return data;
};

const getClassificationById = async (classificationId) => {
  const queryText =
    "SELECT * from course_340.classification WHERE classification_id = $1";
  try {
    const data = await pool.query(queryText, [classificationId]);
    return data.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const getInventoryByClassificationId = async (classificationId) => {
  const queryText =
    "SELECT * from course_340.inventory as i JOIN course_340.classification as c ON i.classification_id = c.classification_id WHERE c.classification_id = $1";
  try {
    const data = await pool.query(queryText, [classificationId]);
    return data.rows;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const getInventoryItemById = async (itemId) => {
  const queryText =
    "SELECT * from course_340.inventory as i join course_340.classification as c on i.classification_id = c.classification_id WHERE inv_id = $1";
  try {
    const data = await pool.query(queryText, [itemId]);
    return data.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const createCategory = async (categoryName) => {
  try {
    const isDupe = await categoryIsDupe(categoryName);
    if (isDupe) {
      throw new Error("Category already exists");
    } else {
      const queryText =
        "INSERT INTO course_340.classification (classification_name) VALUES ($1) RETURNING *";
      try {
        const res = await pool.query(queryText, [categoryName]);
        return res.rows[0];
      } catch (e) {
        throw new Error(e.message);
      }
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const createInventoryItem = async (itemData) => {
  const queryText =
    "INSERT INTO course_340.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
  try {
    const res = await pool.query(queryText, [
      itemData.make,
      itemData.model,
      itemData.year,
      itemData.description,
      itemData.imagePath,
      itemData.thumbnailPath,
      itemData.price,
      itemData.mileage,
      itemData.color,
      itemData.classificationId,
    ]);
    return res.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const categoryIsDupe = async (categoryName) => {
  const queryText =
    "SELECT * FROM course_340.classification WHERE classification_name = $1";
  try {
    const res = await pool.query(queryText, [categoryName]);
    return res.rowCount > 0 ? true : false;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const classificationIdIsDupe = async (classificationId) => {
  const queryText =
    "SELECT * FROM course_340.classification WHERE classification_id = $1";
  try {
    const res = await pool.query(queryText, [classificationId]);
    return res.rowCount > 0 ? true : false;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const updateInventoryItem = async (data) => {
  const queryText = `UPDATE course_340.inventory SET 
      inv_make = $1,
      inv_model = $2,
      inv_year = $3,
      inv_description = $4,
      inv_image = $5,
      inv_thumbnail = $6,
      inv_price = $7,
      inv_miles = $8,
      inv_color = $9,
      classification_id = $10
    WHERE inv_id = $11 RETURNING *`;
  try {
    const res = await pool.query(queryText, [
      data.make,
      data.model,
      data.year,
      data.description,
      data.imagePath,
      data.thumbnailPath,
      data.price,
      data.mileage,
      data.color,
      data.classificationId,
      data.id,
    ]);
    if (res.rows.length === 0) {
      throw new Error("query executed successfully, but nothing was updated");
    }
    return res.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const deleteInventoryItem = async (itemId) => {
  const queryText =
    "DELETE FROM course_340.inventory WHERE inv_id = $1 returning *";
  try {
    const res = await pool.query(queryText, [itemId]);
    return res.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

export default {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryItemById,
  createCategory,
  createInventoryItem,
  categoryIsDupe,
  classificationIdIsDupe,
  getClassificationById,
  updateInventoryItem,
  deleteInventoryItem,
};
