const Joi = require("joi");
const { Op } = require("sequelize");
const {
  Product,
  ProductImage,
  ProductVariant,
  Category,
  CartItem,
  Cart,
} = require("../model");
const { cartItem, cartCheckout } = require("../validation");

const addItemToCart = async (req, res, next) => {
  try {
    const value = await cartItem.validateAsync(req.body);
    const item = await CartItem.create({
      ...value.value,
      user_id: req.user.id,
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

const editItemInCart = async (req, res, next) => {
  try {
    const value = await cartItem.validateAsync(req.body);
    const item = await CartItem.find({
      where: {
        product_id: value.value.product_id,
        variant_id: value.value.variant_id,
        cart_id: null,
      },
    });
    if (item.number == 0) {
      await item.destroy();
    } else {
      item.number = value.value.number;
      await item.save();
    }

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

const deleteItemInCart = async (req, res, next) => {
  try {
    const product_id = req.params.product_id;
    const variant_id = req.params.variant_id;

    const item = await CartItem.find({
      where: {
        product_id: product_id,
        variant_id: variant_id,
        cart_id: null,
      },
    });
    if (item != null) {
      await item.destroy();
    }

    res.json({
      status: "success",
      message: "Remove item successfull",
      data: item,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Remove item failed!",
      data: err.details ?? {},
    });
  }
};

const getCartItems = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const items = await CartItem.findAll({
      where: {
        user_id: user_id,
        cart_id: null,
      },
    });

    res.json({
      status: "success",
      message: "Remove item successfull",
      data: items,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Remove item failed!",
      data: err.details ?? {},
    });
  }
};

const checkoutCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const value = await cartCheckout.validateAsync(req.body);

    //calculate amount in cart's beforeUpdate
    const cartCheckout = await Cart.create({
      ...value.value,
      user_id: user_id,
    });

    CartItem.update(
      { cart_id: cartCheckout.id },
      {
        where: {
          user_id: user.id,
          cart_id: null,
        },
      }
    );

    // const items = await CartItem.findAll({
    //   where: {
    //     user_id: user_id,
    //   },
    // });

    res.json({
      status: "success",
      message: "Remove item successfull",
      data: items,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Remove item failed!",
      data: err.details ?? {},
    });
  }
};

module.exports = {
  addItemToCart,
  editItemInCart,
  deleteItemInCart,
  getCartItems,
  checkoutCart,
};
