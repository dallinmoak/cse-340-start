import pool from "../database/index.js";

const createAccount = async (account) => {
  try {
    const { firstName, lastName, email, password } = account;
    const sql = `
      INSERT INTO course_340.account (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ( $1, $2, $3, $4, 'Client') returning *;
    `;
    const data = await pool.query(sql, [firstName, lastName, email, password]);
    return data;
  } catch (e) {
    return e.message;
  }
};

const emailIsDupe = async (email) => {
  try {
    const rows = await getAccountByEmail(email);
    return rows.length > 0 ? true : false;
  } catch (e) {
    console.log(e);
  }
};

const getAccountByEmail = async (email) => {
  try {
    const queryText =
      "SELECT * FROM course_340.account WHERE account_email = $1";
    const res = await pool.query(queryText, [email]);
    return res.rows;
  } catch (e) {
    console.log(e);
  }
};

const getAccountById = async (id) => {
  try {
    const queryText = "SELECT * FROM course_340.account WHERE account_id = $1";
    const res = await pool.query(queryText, [id]);
    return res.rows[0];
  } catch (e) {
    console.log(e);
  }
};

export { createAccount, emailIsDupe, getAccountByEmail, getAccountById };
