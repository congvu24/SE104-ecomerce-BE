const { User, Address } = require("../model");
var jwt = require("jsonwebtoken");
const { comparePassword } = require("../utils/hashPassword");
const {
  registerUserSchema,
  loginSchema,
  addressSchema,
} = require("../validation");
const Joi = require("joi");

const createUser = async (req, res, next) => {
  try {
    const value = await registerUserSchema.validateAsync({
      ...req.body,
    });

    const newUser = await User.create({
      ...value,
    });

    res.json({
      status: "success",
      message: "Create user successfull",
      data: { ...newUser.dataValues },
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
          { email: user.email, id: user.id },
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
    const user = await User.findAll({
      attributes: [
        "id",
        "email",
        "fullname",
        "age",
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

module.exports = {
  createUser,
  login,
  getProfile,
  addAddress,
  deleteAddress,
};
