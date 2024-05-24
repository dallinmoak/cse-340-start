import pg from "pg";
import "dotenv/config";

const Pool = pg.Pool;

let pool;
const dbConnection = {
  connectionString: process.env.DB_CONNECTION_STRING,
};
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    ...dbConnection,
    ssl: { rejectUnauthorized: false },
  });
  pool.query = async (text, params) => {
    try {
      const res = await pool.query(text, params);
      console.log("query executed successfully", { text });
      return res;
    } catch (e) {
      console.error(e, { text });
      throw error;
    }
  };
} else {
  pool = new Pool({ ...dbConnection });
}

export default pool;
