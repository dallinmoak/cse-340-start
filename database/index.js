import pg from "pg";
import "dotenv/config";

const Pool = pg.Pool;

const devMode = process.env.NODE_ENV === "development";
//log queries by default in dev mode
let shouldLogQueries = devMode;
//override log queries setting from env variable
if (process.env.DEV_PREFS_LOG_QUERY === "false") shouldLogQueries = false;

let defaultExport;
const dbConnection = {
  connectionString: process.env.DB_CONNECTION_STRING,
};
if (devMode) {
  const pool = new Pool({
    ...dbConnection,
    ssl: { rejectUnauthorized: false },
  });
  defaultExport = {
    query: async (text, params) => {
      try {
        const res = await pool.query(text, params);
        if (shouldLogQueries) {
          console.log("query executed successfully", { text });
        }
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
