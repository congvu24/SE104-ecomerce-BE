const Joi = require("joi");
const { Op } = require("sequelize");
const { CardType } = require("../model");
const { cardType } = require("../validation");

const createCardType = async (req, res, next) => {
  try {
    const value = await cardType.validateAsync(req.body);
    const item = await CardType.create({
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

const editCardType = async (req, res, next) => {
  try {
    const id = req.params["id"];
    const value = await cardType.validateAsync(req.body);
    const item = await CardType.findOne({
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

const deleteCardType = async (req, res, next) => {
  try {
    const id = req.params["id"];

    const item = await CardType.destroy({
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

const getAllCardType = async (req, res, next) => {
  try {
    const items = await CardType.findAll({ nest: true });

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
  createCardType,
  editCardType,
  deleteCardType,
  getAllCardType,
};
