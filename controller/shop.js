const Joi = require("joi");
const { Op } = require("sequelize");
const { Product, ProductImage, ProductVariant, Category } = require("../model");

const getProductDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);

    const product = await Product.findOne({
      where: { id: value.value },
      include: [ProductVariant, { model: ProductImage, as: "images" }],
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get product successfull",
      data: product,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get product failed!",
      data: err.details ?? {},
    });
  }
};

const searchByName = async (req, res, next) => {
  try {
    const query = req.query.query;
    const value = Joi.string().validate(query);

    const products = await Product.findAll({
      where: { name: { [Op.like]: "%" + value.value + "%" } },
      include: [ProductVariant, { model: ProductImage, as: "images" }],
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get product successfull",
      data: products,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get product failed!",
      data: err.details ?? {},
    });
  }
};

const getNewProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
      include: [ProductVariant, { model: ProductImage, as: "images" }],
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get product successfull",
      data: products,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get product failed!",
      data: err.details ?? {},
    });
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findAll({
      order: [["createdAt", "DESC"]],
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get catgory successfull",
      data: category,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get category failed!",
      data: err.details ?? {},
    });
  }
};

const getProductOfCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);

    const products = await Product.findAll({
      where: { category_id: value.value },
      order: [["createdAt", "DESC"]],
      include: [ProductVariant, { model: ProductImage, as: "images" }],
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get product successfull",
      data: products,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get product failed!",
      data: err.details ?? {},
    });
  }
};

const getRecommendProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
      include: [ProductVariant, { model: ProductImage, as: "images" }],
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get product successfull",
      data: products,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get product failed!",
      data: err.details ?? {},
    });
  }
};

const getRelateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);

    const nowProduct = await Product.find({
      where: { id: value.value },
      nest: true,
    });

    const products = await Product.find({
      where: {
        $or: {
          $like: {
            name: nowProduct.name,
          },
          category_id: nowProduct.category_id,
        },
      },
      order: [["createdAt", "DESC"]],
      include: [ProductVariant, { model: ProductImage, as: "images" }],
      nest: true,
    });

    res.json({
      status: "success",
      message: "Get product successfull",
      data: products,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get product failed!",
      data: err.details ?? {},
    });
  }
};

module.exports = {
  getProductDetail,
  searchByName,
  getNewProduct,
  getCategory,
  getProductOfCategory,
  getRecommendProduct,
  getRelateProduct,
};
