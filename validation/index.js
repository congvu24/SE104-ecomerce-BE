const Joi = require("joi");
const moment = require("moment");

const registerUserSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  birthYear: Joi.number().integer().min(1980).max(2021).required(),
  avatar: Joi.string(),
  sex: Joi.number().integer().min(0).max(2).required(),
  identify_number: Joi.string().min(8).max(20).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
});

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
});

const addressSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  image: Joi.string(),
});

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  category_id: Joi.number().required(),
  content: Joi.string().allow('', null),
  unit: Joi.string(),
  images: Joi.array().items({ name: Joi.string() }),
});

const variantSchema = Joi.object({
  name: Joi.string().required(),
  product_id: Joi.number().integer().required(),
  stock: Joi.number().integer().required(),
  price: Joi.number().required(),
  cost_price: Joi.number()
});

const cartItem = Joi.object({
  product_id: Joi.number().integer().required(),
  variant_id: Joi.number().integer().required(),
  number: Joi.number().integer().required(),
});

const cartCheckout = Joi.object({
  address: Joi.number().integer().required(),
  // discount: Joi.string(),
  shipping_method_id: Joi.number().required(),
  card_id: Joi.number().required(),
  discount: Joi.string(),
});

const shippingMethod = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  fee: Joi.number().required(),
});

const cardType = Joi.object({
  name: Joi.string().required(),
  fee: Joi.number().required(),
});

const discount = Joi.object({
  percentage: Joi.number().min(0).max(1).required(),
  code: Joi.string().required(),
  exp: Joi.string().required(),
  number: Joi.number().integer(),
  max: Joi.number().integer(),
});

const cardSchema = Joi.object({
  card_type_id: Joi.number().integer().required(),
  cvv: Joi.number().integer().required(),
  number: Joi.string().required(),
  date_exp: Joi.string().required(),
  owner: Joi.string().required(),
});

module.exports = {
  registerUserSchema,
  loginSchema,
  addressSchema,
  categorySchema,
  productSchema,
  variantSchema,
  cartItem,
  cartCheckout,
  shippingMethod,
  cardType,
  discount,
  cardSchema
};
