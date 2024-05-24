import invModel from "../models/inventory-model.js";
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

export default { getNavData };
