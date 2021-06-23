const Joi = require("joi");
const {
  User,
  Cart,
  Discount,
  Address,
  ShippingMethod,
  Product,
  CartItem,
  ProductVariant,
  ProductImage,
  Card,
  CardType,
} = require("../model");
const { Sequelize, Op } = require("sequelize");

const getOrders = async (req, res, next) => {
  try {
    const { year, month } = req.params;

    const result = await Cart.findAll({
      where:
        year && month
          ? {
              [Op.and]: [
                Sequelize.where(
                  Sequelize.fn("YEAR", Sequelize.col("user_carts.createdAt")),
                  year
                ),
                Sequelize.where(
                  Sequelize.fn("MONTH", Sequelize.col("user_carts.createdAt")),
                  month
                ),
              ],
            }
          : {},
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "password",
              "role",
              "resetToken",
              "lastAccess",
              "avatar",
              "identify_number",
              "address",
              "sex",
              "phone",
              "birthYear",
            ],
          },
        },
        {
          model: Discount,
        },
        {
          model: Address,
        },
        {
          model: ShippingMethod,
        },
        {
          model: CartItem,
          include: [
            { model: ProductVariant },
            {
              model: Product,
              include: [{ model: ProductImage, as: "images" }],
            },
          ],
        },
        { model: Card, include: [{ model: CardType }] },
      ],
    });

    res.json({
      status: "success",
      message: "Get orders successfull",
      data: result,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get orders failed!",
      data: err.details ?? {},
    });
  }
};
const getOrderDetail = async (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "Get analytics successfull",
      data: {},
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get analytics failed!",
      data: err.details ?? {},
    });
  }
};
const getUsers = async (req, res, next) => {
  try {
    const result = await User.findAll({
      attributes: {
        exclude: [
          "password",
          "role",
          "resetToken",
          "lastAccess",
          "avatar",
          "identify_number",
        ],
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("user_carts.user_id")),
            "cart_count",
          ],
          [
            Sequelize.fn("SUM", Sequelize.col("user_carts.amount")),
            "cart_amount",
          ],
        ],
      },
      include: [
        {
          model: Cart,
          attributes: [],
        },
      ],
      where: {
        role: "user",
      },
      group: ["id"],
    });

    res.json({
      status: "success",
      message: "Get users successfull",
      data: result,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get users failed!",
      data: err.details ?? {},
    });
  }
};

const getNumber = async (req, res, next) => {
  try {
    let result = {
      product_count: 0,
      orders: {
        count: 0,
        amount: 0,
      },
      user_count: 0,
    };

    result.product_count = await Product.count();
    result.user_count = await User.count();
    result.orders = await Cart.findAll({
      attributes: [
        [Sequelize.fn("count", Sequelize.col("id")), "count"],
        [Sequelize.fn("sum", Sequelize.col("amount")), "amount"],
      ],
      group: ["id"],
    });
    res.json({
      status: "success",
      message: "Get number successfull",
      data: result,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Get number failed!",
      data: err.details ?? {},
    });
  }
};

module.exports = {
  getOrders,
  getOrderDetail,
  getUsers,
  getNumber,
};
