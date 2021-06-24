const { Category, Product, ProductVariant, ProductImage } = require("../model");
const { productSchema, variantSchema } = require("../validation");
const fs = require("fs");
const Joi = require("joi");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [ProductVariant, { model: ProductImage, as: "images" }],
      nest: true,
    });

    // await products.forEach(async (item) => {
    //   const imageList = await ProductImage.findAll({
    //     where: {
    //       product_id: item.id,
    //     },
    //     nest: true,
    //   });
    //   item.images = imageList;
    // });

    // console.log(products)

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

const getProductDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);

    const product = await Product.findOne({
      where: { id: value.value },
      include: [
        ProductVariant,
        { model: ProductImage, as: "images" },
        Category,
      ],
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

const createProduct = async (req, res, next) => {
  try {
    const value = await productSchema.validateAsync({
      ...req.body,
    });

    const newProduct = await Product.create(
      {
        ...value,
      },
      {
        include: [{ model: ProductImage, as: "images" }],
      }
    );

    res.json({
      status: "success",
      message: "Create product successfull",
      data: { ...newProduct.dataValues },
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Create product failed!",
      data: err.details ?? {},
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);
    Product.destroy({ where: { id: value.value } });
    res.json({
      status: "success",
      message: "Delete product success!",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Delete product failed!",
      data: err.details ?? {},
    });
  }
};

const editProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = Joi.number().integer().validate(id);
    const item = await Product.findOne({ where: { id: value.value } });

    const update = await productSchema.validateAsync({ ...req.body });
    await item.update({ ...update });
    await item.save();

    res.json({
      status: "success",
      message: "Edit product success!",
      data: {},
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: "failed",
      message: "Edit product failed!",
      data: err.details ?? {},
    });
  }
};

const editProductVariant = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const variantId = req.params.variantID;
    const item = await ProductVariant.findOne({
      where: { id: variantId, product_id: productId },
    });

    const update = await variantSchema.validateAsync({ ...req.body });
    await item.update({ ...update });
    await item.save();

    res.json({
      status: "success",
      message: "Edit variant success!",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Edit variant failed!",
      data: err.details ?? {},
    });
  }
};

const addVariant = async (req, res, next) => {
  const id = req.params.id;
  try {
    const value = await variantSchema.validateAsync({
      ...req.body,
      product_id: id,
    });

    const newVariant = await ProductVariant.create({
      ...value,
    });

    res.json({
      status: "success",
      message: "Create variant successfull",
      data: { ...newVariant.dataValues },
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Create variant failed!",
      data: err.details ?? {},
    });
  }
};

const deleteVariant = async (req, res, next) => {
  try {
    const id = req.params.id;
    const variantId = req.query["id"];

    const value = Joi.number().integer().validate(id);
    const valueVariant = Joi.number().integer().validate(variantId);
    ProductVariant.destroy({
      where: { product_id: value.value, id: valueVariant.value },
    });
    res.json({
      status: "success",
      message: "Delete variant success!",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Delete variant failed!",
      data: err.details ?? {},
    });
  }
};

const uploadProductImage = async (req, res, next) => {
  try {
    const file = req.file;
    res.json({
      status: "success",
      message: "Upload product image success!",
      data: { filename: file.filename },
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: "Upload product image failed!",
      data: err.details ?? {},
    });
  }
};

const deleteProductImage = async (req, res, next) => {
  const filename = req.params.filename;
  const filepath = `uploads/product/${filename}`;
  try {
    result = await ProductImage.destroy({ where: { name: filename } });
    results = await ProductImage.findAll({ where: { name: filename } });
    fs.unlinkSync(filepath);

    res.json({
      status: "success",
      message: "Delete product image success!",
      data: { filename: filename },
    });
  } catch (err) {
    res.json({
      status: "success",
      message: "Delete product image success!",
      data: { filename: filename },
    });
  }
};

const addProductImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const imageName = req.body.image;
    if (Array.isArray(imageName)) {
      await imageName.forEach(async (img) => {
        console.log(img)
        const image = await ProductImage.create({
          product_id: id,
          name: img,
        });
        console.log(image);
      });
    } else {
      await ProductImage.create({
        product_id: id,
        name: imageName,
      });
    }

    res.json({
      status: "success",
      message: "Add product image success!",
      data: {},
    });
  } catch (err) {
    res.json({
      status: "success",
      message: "Add product image success!",
      data: {},
    });
  }
};

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  addVariant,
  deleteVariant,
  getProducts,
  getProductDetail,
  uploadProductImage,
  deleteProductImage,
  editProductVariant,
  addProductImage,
};
