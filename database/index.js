import pg from "pg";
import "dotenv/config";

const Pool = pg.Pool;

let defaultExport;
const dbConnection = {
  connectionString: process.env.DB_CONNECTION_STRING,
};
console.log("****db initialze env", process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  const pool = new Pool({
    ...dbConnection,
    ssl: { rejectUnauthorized: false },
  });
  defaultExport = {
    query: async (text, params) => {
      try {
        const res = await pool.query(text, params);
        console.log("query executed successfully", { text });
        return res;
      } catch (e) {
        console.error(e, { text });
        throw e;
      }
    },
  };
} else {
  defaultExport = new Pool({ ...dbConnection });
}

export default defaultExport;
