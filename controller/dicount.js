const Joi = require("joi");
const { Op } = require("sequelize");
const { Discount } = require("../model");
const { discount } = require("../validation");

const createDiscount = async (req, res, next) => {
  try {
    const value = await discount.validateAsync(req.body);
    const item = await Discount.create({
      ...value,
    });

    res.json({
      status: "success",
      message: "Add item successfull",
      data: item,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Add item failed!",
      data: err.details ?? {},
    });
  }
};

const editDiscount = async (req, res, next) => {
  try {
    const id = req.params["id"];
    const value = await discount.validateAsync(req.body);
    const item = await Discount.findOne({
      where: { id: id },
    });

    await item.update({ ...value });
    await item.save();

    res.json({
      status: "success",
      message: "Edit item successfull",
      data: item,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Edit item failed!",
      data: err.details ?? {},
    });
  }
};

const deleteDiscount = async (req, res, next) => {
  try {
    const id = req.params["id"];

    const item = await Discount.destroy({
      where: { id: id },
    });

    res.json({
      status: "success",
      message: "Delete item successfull",
      data: {},
    });
  } catch (err) {
    res.json({
      status: "success",
      message: "Delete item successfull",
      data: {},
    });
  }
};

const getAllDiscount = async (req, res, next) => {
  try {
    const items = await Discount.findAll({ nest: true });

    res.json({
      status: "success",
      message: "Get items successfull",
      data: items,
    });
  } catch (err) {
    res.json({
      status: "success",
      message: "Get items failed",
      data: items,
    });
  }
};

const getDiscountDetail = async (req, res, next) => {
  try {
    const code = req.params.code;
    const discount = await Discount.findOne({ where: { code } });

    res.json({
      status: "success",
      message: "Get discount successfull",
      data: discount,
    });
  } catch (err) {
    res.json({
      status: "success",
      message: "Get discount failed",
      data: items,
    });
  }
};

module.exports = {
  createDiscount,
  editDiscount,
  deleteDiscount,
  getAllDiscount,
  getDiscountDetail,
};
