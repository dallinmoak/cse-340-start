import invModel from "../models/inventory-model.js";
import "dotenv/config";

const { getClassifications } = invModel;
const getNavData = async () => {
  const data = await getClassifications();
  const dataFormatted = data.rows.map((row) => {
    return {
      id: row.classification_id,
      name: row.classification_name,
    };
  });
  return dataFormatted;
};

const handleErrors = (fn) => {
  const wrapper = (req, res, next) => {
    const fnResult = fn(req, res, next);
    const resolution = Promise.resolve(fnResult);
    return resolution.catch(next);
  };
  return wrapper;
};

const errorResponder = async (e, req, res, next) => {
  const navData = await getNavData();
  console.error(`error at ${req.originalUrl}`, e);
  if (process.env.NODE_ENV != "development") {
    if (e.status != 404) {
      e.status = 500;
      e.message = `Server Error. Verbose output is disabled in ${process.env.NODE_ENV}.`;
    }
  }
  res.render("errors/error", {
    title: e.status || "Server Error",
    message: e.message,
    navData,
  });
};
export { getNavData, handleErrors, errorResponder };