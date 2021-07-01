const { Category } = require("../model");
const { categorySchema } = require("../validation");
const Joi = require("joi");

const createCategory = async (req, res, next) => {
  try {
    const value = await categorySchema.validateAsync({
      ...req.body,
    });

    const newCategory = await Category.create({
      ...value,
    });

    res.json({
      status: "success",
      message: "Create category successfull",
      data: { ...newCategory.dataValues },
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Create category failed!",
      data: err.details ?? {},
    });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);
    Category.destroy({ where: { id: value.value } });
    res.json({
      status: "success",
      message: "Delete category success!",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Delete category failed!",
      data: err.details ?? {},
    });
  }
};

const editCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);
    const category = await Category.findOne({ where: { id: value.value } });

    const update = await categorySchema.validateAsync({ ...req.body });
    await category.update({ ...update });
    await category.save();

    res.json({
      status: "success",
      message: "Edit category success!",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Edit category failed!",
      data: err.details ?? {},
    });
  }
};

const getCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get category successfull",
      data: categories,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get category failed!",
      data: err.details ?? {},
    });
  }
};

const uploadCategoryImage = async (req, res, next) => {
  try {
    const file = req.file;
    res.json({
      status: "success",
      message: "Upload category image success!",
      data: { filename: file.filename },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Upload category image failed!",
      data: err.details ?? {},
    });
  }
};

module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  uploadCategoryImage,
  getCategory,
};
