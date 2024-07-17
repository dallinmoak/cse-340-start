import {
  getAddCategoryForm,
  getAddItemForm,
  getPageData,
  getReviewForm,
} from "../utils/index.js";
import inventoryModel from "../models/inventory-model.js";

const buildByClassificationId = async (req, res, next) => {
  const classification_id = req.params.classificationId;
  try {
    const invData = await inventoryModel.getInventoryByClassificationId(
      classification_id
    );
    if (!invData) {
      return next({
        status: 404,
        message: `classification id "${classification_id}" not found`,
      });
    }
    const category = await inventoryModel.getClassificationById(
      classification_id
    );
    const pageData = await getPageData(req, res);
    res.render("pages/inventory/classification", {
      title: `${category.classification_name} Cars`,
      pageData,
      classification: {
        id: classification_id,
        name: category.classification_name,
      },
      invList: invData,
    });
  } catch (e) {
    return next({
      status: 500,
      message: `error retrieving inventory data: ${e.message}`,
    });
  }
};

const builByInventoryId = async (req, res, next) => {
  try {
    const invItem = await inventoryModel.getInventoryItemById(
      req.params.itemId
    );
    if (!invItem || invItem.length === 0) {
      return next({
        status: 404,
        message: `inventory item id "${req.params.itemId}" not found`,
      });
    }
    const pageData = await getPageData(req, res);
    const reviewForm = getReviewForm(
      null,
      invItem.inv_id,
      pageData.user?.account_id
    );
    res.render("pages/inventory/item", {
      title: `${invItem.inv_year} ${invItem.inv_make} ${invItem.inv_model}`,
      pageData,
      invItem,
      reviewForm,
      showForm: false,
    });
  } catch (e) {
    return next({
      status: 500,
      message: `error retrieving inventory data: ${e.message}`,
    });
  }
};

const buildAdminView = async (req, res) => {
  const categories = (await inventoryModel.getClassifications()).rows.map(
    (row) => {
      return {
        value: row.classification_id,
        label: row.classification_name,
      };
    }
  );
  const viewCategoriesConfig = {
    label: "View records from a specific category: ",
    name: "category",
    id: "category",
    type: {
      options: categories,
    },
    placeholder: "Select...",
    required: false,
    value: "",
  };

  res.render("pages/inventory/admin", {
    title: "Vehicle Management",
    pageData: await getPageData(req, res),
    viewCategoriesConfig,
  });
};

const buildAddCategoryView = async (req, res) => {
  res.render("pages/inventory/add-category", {
    title: "Add Vehicle Category",
    pageData: await getPageData(req, res),
    formConfig: getAddCategoryForm(),
  });
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newRecord = await inventoryModel.createCategory(name);
    if (!newRecord) {
      throw new Error("Error creating category");
    } else {
      req.flash(
        "success",
        `Category ${newRecord.classification_name} added successfully`
      );
      res.redirect("/inv");
    }
  } catch (e) {
    return next({
      status: 500,
      message: `error adding category: ${e.message}`,
    });
  }
};

const buildAddItemView = async (req, res) => {
  res.render("pages/inventory/add-item", {
    title: "Add Vehicle",
    pageData: await getPageData(req, res),
    formConfig: await getAddItemForm(),
  });
};

const addItem = async (req, res, next) => {
  const newData = req.body;
  try {
    const newRecord = await inventoryModel.createInventoryItem({ ...newData });
    if (!newRecord) {
      throw new Error("Error adding item");
    } else {
      req.flash(
        "success",
        `Vehicle with id ${newRecord.inv_id} added successfully`
      );
      res.redirect(`/inv/item/${newRecord.inv_id}`);
    }
  } catch (e) {
    return next({
      status: 500,
      message: `error adding item: ${e.message}`,
    });
  }
};

const apiGetInventoryRecordsByType = async (req, res, next) => {
  const classificationId = req.params.classificationId;
  const invData = await inventoryModel.getInventoryByClassificationId(
    classificationId
  );
  res.json(invData);
};

const getEditForm = async (req, res, next) => {
  const invItem = await inventoryModel.getInventoryItemById(req.params.itemId);
  if (!invItem || invItem.length === 0) {
    next({
      status: 404,
      message: `inventory item id "${req.params.itemId}" not found`,
    });
  }
  const prefils = {
    classificationId: invItem.classification_id,
    make: invItem.inv_make,
    model: invItem.inv_model,
    description: invItem.inv_description,
    imagePath: invItem.inv_image,
    thumbnailPath: invItem.inv_thumbnail,
    price: invItem.inv_price,
    year: invItem.inv_year,
    mileage: invItem.inv_miles,
    color: invItem.inv_color,
  };
  const addItemForm = await getAddItemForm(prefils);
  const editForm = {
    ...addItemForm,
    action: `/inv/edit/${invItem.inv_id}`,
    submitLabel: "Update Vehicle",
  };
  res.render("pages/inventory/edit-item", {
    title: `Edit ${invItem.inv_year} ${invItem.inv_make} ${invItem.inv_model}`,
    pageData: await getPageData(req, res),
    formConfig: editForm,
  });
};

const editItem = async (req, res, next) => {
  const editItems = {
    ...req.body,
    id: req.params.itemId,
  };
  try {
    const updatedItem = await inventoryModel.updateInventoryItem(editItems);
    if (!updatedItem) {
      throw new Error("Error updating item");
    } else {
      req.flash(
        "success",
        `Vehicle with id ${updatedItem.inv_id} updated successfully`
      );
      res.redirect(`/inv/item/${updatedItem.inv_id}`);
    }
  } catch (e) {
    return next({
      status: 500,
      message: `error updating item: ${e.message}`,
    });
  }
};

const getDeleteForm = async (req, res, next) => {
  const item = await inventoryModel.getInventoryItemById(req.params.itemId);
  const formConfig = {
    formData: [],
    method: "POST",
    action: `/inv/delete/${req.params.itemId}`,
    submitLabel: "Yes I'm sure",
  };
  res.render("pages/inventory/delete-item", {
    title: "Delete Vehicle",
    pageData: await getPageData(req, res),
    confirmation: `Are you sure you want to delete the ${item.inv_year} ${item.inv_make} ${item.inv_model} with id ${req.params.itemId}?`,
    formConfig,
  });
};

const performDelete = async (req, res, next) => {
  try {
    const deletedItem = await inventoryModel.deleteInventoryItem(
      req.params.itemId
    );
    req.flash("success", `Item with id ${deletedItem.inv_id} deleted`);
    res.redirect("/inv");
  } catch (e) {
    return next({
      status: 500,
      message: `error deleting item: ${e.message}`,
    });
  }
};

export default {
  buildByClassificationId,
  builByInventoryId,
  buildAdminView,
  buildAddCategoryView,
  addCategory,
  buildAddItemView,
  addItem,
  apiGetInventoryRecordsByType,
  getEditForm,
  editItem,
  getDeleteForm,
  performDelete,
};
