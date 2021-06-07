const Joi = require("joi");
const { Op } = require("sequelize");
const {
  Product,
  ProductImage,
  ProductVariant,
  Category,
  CartItem,
  Cart,
  Discount,
  Card,
  ShippingMethod,
  CardType,
} = require("../model");
const { cartItem, cartCheckout } = require("../validation");

const addItemToCart = async (req, res, next) => {
  try {
    const value = await cartItem.validateAsync(req.body);
    const item = await CartItem.create({
      ...value,
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
    const item = await CartItem.findOne({
      where: {
        product_id: value.product_id,
        variant_id: value.variant_id,
        cart_id: null,
      },
    });
    if (value.number == 0) {
      await item.destroy();
    } else {
      item.number = value.number;
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

    const item = await CartItem.findOne({
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
      data: {},
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
      attributes: ["product_id", "variant_id", "number", "id"],
      where: {
        user_id: user_id,
        cart_id: null,
      },
      include: [
        {
          model: Product,
          as: "product",
          include: [{ model: ProductImage, as: "images" }],
        },
        {
          model: ProductVariant,
          as: "product_variant",
          attributes: ["name", "price"],
        },
      ],
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

    const discount = await Discount.findOne({
      where: { id: value.discount_id },
    });

    const card = await Card.findOne({
      where: { id: value.card_id, user_id: user_id },
      include: [CardType],
    });

    const shippingMethod = await ShippingMethod.findOne({
      where: { id: value.shipping_method_id },
    });

    const allItems = await CartItem.findAll({
      where: {
        user_id: user_id,
        cart_id: null,
      },
      include: [
        {
          model: Product,
          as: "product",
        },
        {
          model: ProductVariant,
          as: "product_variant",
        },
      ],
      // nest: true,
    });

    let sumMoneyProducts = 0;

    await allItems.forEach(async (item) => {
      console.log(item.product_variant);
      if (item.product_variant.number <= 0)
        throw new Error(
          `Variant: ${item.product_variant.name} is out of stock!`
        );
      else {
        sumMoneyProducts =
          sumMoneyProducts + item.number * item.product_variant.price;
        item.product_variant.update({
          stock: item.product_variant.stock - item.number,
        });
        item.product_variant.save();
      }
    });

    const amountWithDiscount =
      sumMoneyProducts - sumMoneyProducts * discount.percentage;

    const amount = amountWithDiscount + amountWithDiscount * card.card_type.fee;

    const cart = await Cart.create({
      ...value,
      user_id: user_id,
      status: "pending",
      amount: amount,
    });
    console.log(cartCheckout);
    await CartItem.update(
      { cart_id: cart.id },
      {
        where: {
          user_id: user_id,
          cart_id: null,
        },
      }
    );
    res.json({
      status: "success",
      message: "Checkout item successfull",
      data: cart,
    });
  } catch (err) {
    console.log(err)
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Checkout item failed!",
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
