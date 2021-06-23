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

    const product_variant = await ProductVariant.findOne({
      where: {
        id: value.variant_id,
        product_id: value.product_id,
        stock: { [Op.gte]: value.number },
      },
    });

    if (product_variant == null)
      throw new Error("Variant is not enough stock or not exist!");

    const exist = await CartItem.findOne({
      where: {
        product_id: value.product_id,
        variant_id: value.variant_id,
        cart_id: { [Op.eq]: null },
        user_id: req.user.id,
      },
    });
    console.log("data", exist);
    if (exist != null)
      throw new Error(
        "This item has been on your cart, just modify the number or delete it!"
      );

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

    const product_variant = await ProductVariant.findOne({
      where: {
        id: value.variant_id,
        product_id: value.product_id,
      },
      nest: true,
    });

    if (product_variant.stock < value.number)
      throw new Error("Variant is not enough stock or not exist!");

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
    const user_id = req.user.id;
    const product_id = req.params.product_id;
    const variant_id = req.params.variant_id;

    const item = await CartItem.findOne({
      where: {
        product_id: product_id,
        variant_id: variant_id,
        cart_id: null,
        user_id: user_id,
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

    let discount = null;
    if (value.discount) {
      discount = await Discount.findOne({
        where: { code: value.discount, number: { [Op.gt]: 0 } },
      });
      if (discount == null)
        throw new Error("Discount is not available or not exist!");
    }

    const card = await Card.findOne({
      where: { id: value.card_id, user_id: user_id },
      include: [CardType],
    });
    if (card == null) throw new Error("Card is not available or not exist!");

    const shippingMethod = await ShippingMethod.findOne({
      where: { id: value.shipping_method_id },
    });
    if (shippingMethod == null)
      throw new Error("Shipping method is not available or not exist!");

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
      nest: true,
    });

    if (allItems.length == 0) throw new Error("Can not checkout empty cart!");

    let sumMoneyProducts = 0;

    let err = null;
    allItems.every(async (item) => {
      if (item.product_variant.stock <= 0) {
        err = new Error(
          `Variant: ${item.product_variant.name} is out of stock!`
        );
        return false;
      } else if (item.product_variant.stock < item.number) {
        err = new Error(
          `Variant: ${item.product_variant.name}' stock is not enough to checkout!`
        );
        return false;
      }
    });
    if (err) throw err;

    allItems.every(async (item) => {
      if (err == null) {
        sumMoneyProducts =
          sumMoneyProducts + item.number * item.product_variant.price;
        item.product_variant.stock = item.product_variant.stock - item.number;
        await item.product_variant.save();
        return true;
      }
    });

    let amountWithDiscount = 0;
    let amount = 0;

    if (discount != null) {
      const amountDiscount =
        sumMoneyProducts * discount.percentage > discount.max
          ? discount.max
          : sumMoneyProducts * discount.percentage;
      amountWithDiscount = sumMoneyProducts - amountDiscount;
      console.log(amountWithDiscount);
      amount =
        amountWithDiscount +
        amountWithDiscount * card.card_type.fee +
        amountWithDiscount * shippingMethod.fee;
      discount.number = discount.number == 1 ? 0 : discount.number - 1;
      await discount.save();
    } else {
      amount =
        sumMoneyProducts +
        sumMoneyProducts * card.card_type.fee +
        sumMoneyProducts * shippingMethod.fee;
    }

    const cart = await Cart.create({
      ...value,
      user_id: user_id,
      status: "pending",
      amount: amount,
      discount_id: discount ? discount.id : null,
    });
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
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Checkout item failed!",
      data: err.details ?? {},
    });
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: {
        id,
        user_id: userId,
      },
    });
    // pending, confirm, success, cancel
    if (cart) {
      if (cart.status == "pending") {
        cart.status = "cancel";
        await cart.save();
        res.json({
          status: "success",
          message: "Cancel cart successfull",
          data: cart,
        });
      } else {
        throw new Error("Can't cancel this cart");
      }
    }
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Cancel cart failed!",
      data: err.details ?? {},
    });
  }
};

const orderStatus = ["pending", "confirm", "success", "cancel", "complete"];
const changeOrderStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (orderStatus.indexOf(status) < 0) {
      throw new Error("Status not allowed");
    }

    const cart = await Cart.findOne({
      where: {
        id,
      },
    });
    // pending, confirm, success, cancel
    if (cart) {
      cart.status = status;
      await cart.save();
      res.json({
        status: "success",
        message: "Update cart status successfull",
        data: cart,
      });
    } else {
      throw new Error("Can't Update cart status");
    }
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Update cart status failed!",
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
  cancelOrder,
  changeOrderStatus,
};
