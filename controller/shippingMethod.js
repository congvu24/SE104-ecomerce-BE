const Joi = require("joi");
const { Op } = require("sequelize");
const { ShippingMethod } = require("../model");
const { shippingMethod } = require("../validation");

const createShippingMethod = async (req, res, next) => {
  try {
    const value = await shippingMethod.validateAsync(req.body);
    const item = await ShippingMethod.create({
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

const editShippingMethod = async (req, res, next) => {
  try {
    const id = req.params["id"];
    const value = await shippingMethod.validateAsync(req.body);
    const item = await ShippingMethod.findOne({
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

const deleteShippingMethod = async (req, res, next) => {
  try {
    const id = req.params["id"];

    const item = await ShippingMethod.destroy({
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

const getAllShippingMethod = async (req, res, next) => {
  try {
    const items = await ShippingMethod.findAll({ nest: true });

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

module.exports = {
  createShippingMethod,
  editShippingMethod,
  deleteShippingMethod,
  getAllShippingMethod,
};
