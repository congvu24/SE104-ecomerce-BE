const {
  User,
  Address,
  Card,
  CardType,
  Cart,
  Discount,
  Product,
  ProductVariant,
  ProductImage,
  CartItem,
} = require("../model");
var jwt = require("jsonwebtoken");
const { comparePassword } = require("../utils/hashPassword");
const {
  registerUserSchema,
  loginSchema,
  addressSchema,
  cardSchema,
} = require("../validation");
const Joi = require("joi");

const createUser = async (req, res, next) => {
  try {
    const value = await registerUserSchema.validateAsync({
      ...req.body,
    });

    const newUser = await User.create({
      ...value,
      role: "user",
    });
    const defaultAddress = await Address.create({
      user_id: newUser.id,
      name: "Default Address",
      address: value.address,
      phone: value.phone,
    });

    const token = await jwt.sign(
      { email: newUser.email, id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET
    );

    res.json({
      status: "success",
      message: "Create user successfull",
      data: { token },
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Create user failed!",
      data: err.details ?? {},
    });
  }
};

const login = async (req, res, next) => {
  try {
    const value = await loginSchema.validateAsync({
      ...req.body,
    });

    const user = await User.findOne({ where: { email: value.email } });
    if (user === null) {
      throw new Error("Not exist!");
    } else {
      const compare = await comparePassword(value.password, user.password);
      if (compare == true) {
        const token = await jwt.sign(
          { email: user.email, id: user.id, role: user.role },
          process.env.JWT_SECRET
        );
        res.json({
          status: "success",
          message: "Login success!",
          data: { token },
        });
      } else {
        throw new Error("Wrong password!");
      }
    }
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: "Login failed!",
      data: err.details ?? {},
    });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      attributes: [
        "id",
        "email",
        "fullname",
        "birthYear",
        "avatar",
        "sex",
        "identify_number",
        "address",
      ],
      include: [{ model: Address }],
      where: { email: req.user.email },
    });
    res.json({
      status: "success",
      message: "Success!",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Login failed!",
      data: err.details ?? {},
    });
  }
};

const addAddress = async (req, res, next) => {
  try {
    const value = await addressSchema.validateAsync({
      ...req.body,
    });
    const address = Address.create({ ...value, user_id: req.user.id });
    res.json({
      status: "success",
      message: "Success!",
      data: value,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Create address failed!",
      data: err.details ?? {},
    });
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { value } = Joi.number().integer().validate(id);

    const address = await Address.destroy({
      where: {
        id: value,
        user_id: req.user.id,
      },
    });

    res.json({
      status: "success",
      message: "Success!",
      data: {},
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Delete address failed!",
      data: err.details ?? {},
    });
  }
};

const getAddress = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const result = await Address.findAll({
      where: { user_id: user_id },
    });
    res.json({
      status: "Success",
      message: "Get address success!",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      message: "Get address failed!",
      data: err.details ?? {},
    });
  }
};

const addCard = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const value = await cardSchema.validateAsync({
      ...req.body,
    });
    const newCard = await Card.create({
      ...value,
      user_id: user_id,
    });

    res.json({
      status: "success",
      message: "Create card successfull",
      data: newCard.id,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Create card failed!",
      data: err.details ?? {},
    });
  }
};

const removeCard = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const id = req.params.id;

    const newCard = await Card.destroy({
      where: {
        user_id: user_id,
        id: id,
      },
    });

    res.json({
      status: "success",
      message: "Remove card successfull",
      data: {},
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Remove card failed!",
      data: err.details ?? {},
    });
  }
};

const getAllCard = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    let cards = await Card.findAll({
      where: {
        user_id: user_id,
      },
      attributes: ["number", "id", "owner", "cvv", "date_exp"],
      include: [{ model: CardType, as: "card_type" }],
      nest: true,
    });

    cards.forEach(item=>{
      item.number =+ item.number.slice(0,4)  + ".XXXX.XXXX.XXXX" ;
      item.cvv =item.cvv.slice(0,1) +"XX"  ;
    })

    res.json({
      status: "success",
      message: "Remove card successfull",
      data: cards,
    });
  } catch (err) {
    res.status(442).json({
      status: "failed",
      message: err.message ?? "Remove card failed!",
      data: err.details ?? {},
    });
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const orders = await Cart.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: Address,
        },
        {
          model: Discount,
        },
        {
          model: CartItem,
          include: [
            { model: Product, include: [{ model: ProductImage, as: "images" }] },
            { model: ProductVariant },
          ],
        },
      ],
    });
    res.json({
      status: "success",
      message: "Get order success!",
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Get order failed!",
      data: err.details ?? {},
    });
  }
};

module.exports = {
  createUser,
  login,
  getProfile,
  addAddress,
  deleteAddress,
  addCard,
  removeCard,
  getAllCard,
  getAllOrder,
  getAddress,
};
