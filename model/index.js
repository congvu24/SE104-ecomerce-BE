require("dotenv").config();
var { Sequelize, DataTypes, Model } = require("sequelize");
const Address = require("./address");
const Card = require("./card");
const CardType = require("./cardType");
const Cart = require("./cart");
const CartItem = require("./cartItem");
const Category = require("./category");
const Discount = require("./discount");
const Product = require("./product");
const ProductImage = require("./productImages");
const ProductVariant = require("./productVariant");
const ShippingMethod = require("./shippingMethod");
const User = require("./user");

var sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,

    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);
const db = {
  Address: Address(sequelize),
  User: User(sequelize),
  CardType: CardType(sequelize),
  Cart: Cart(sequelize),
  Card: Card(sequelize),
  CartItem: CartItem(sequelize),
  Category: Category(sequelize),
  Discount: Discount(sequelize),
  Product: Product(sequelize),
  ProductImage: ProductImage(sequelize),
  ProductVariant: ProductVariant(sequelize),
  ShippingMethod: ShippingMethod(sequelize),
};

Object.keys(db).forEach((key) => {
  console.log(key);
  if (db[key].associate) {
    db[key].associate(sequelize);
  }
});

sequelize.sync();

// create admin user
db.User.create({
  id: 0,
  email: "admin@shop.com",
  fullname: "admin",
  password: "admin",
  role: "admin",
});

// db.User.findAll({
//   include: [{ model: db.Address }],
//   // attributes: [
//   //   "id",
//   //   "email",
//   //   "fullname",
//   //   "age",
//   //   "avatar",
//   //   "sex",
//   //   "identify_number",
//   //   "address",
//   // ],
//   raw: true,
//   nest: true,
//   // where: { email: req.user.email },
// }).then((res) => console.log(res));

// db.Address.findAll({
//   include: [{ model: db.User, attributes: ["email"] }],
//   // attributes: [
//   //   "id",
//   //   "email",
//   //   "fullname",
//   //   "age",
//   //   "avatar",
//   //   "sex",
//   //   "identify_number",
//   //   "address",
//   // ],

//   // where: { email: req.user.email },
//   raw: true,
//   nest: true,
// }).then((res) => console.log(res));

module.exports = {
  sequelize,
  ...db,
};

