require("dotenv").config();
var jwt = require("jsonwebtoken");
var { Sequelize, DataTypes } = require("sequelize");
const { hashPassword } = require("../utils/hashPassword");

const User = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      fullname: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING(50),
      },
      sex: {
        type: Sequelize.DataTypes.BOOLEAN,
      },
      identify_number: {
        type: Sequelize.DataTypes.STRING(20),
      },
      password: {
        type: Sequelize.DataTypes.STRING,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      phone: {
        type: Sequelize.DataTypes.STRING,
      },
      role: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: "user",
        allowNull: false,
      },
      birthYear: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      resetToken: {
        type: Sequelize.DataTypes.INTEGER,
      },
      lastAccess: {
        type: Sequelize.DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "users",
    }
  );

  User.associate = ({ models }) => {
    User.hasMany(models.user_addresses, {
      foreignKey: "user_id",
    });
    User.hasMany(models.cart_items, {
      foreignKey: "user_id",
    });
    User.hasMany(models.user_carts, {
      foreignKey: "user_id",
    });
    User.hasMany(models.user_cards, {
      foreignKey: "user_id",
    });
  };

  User.addHook("beforeCreate", async (user) => {
    const exist = await User.findOne({ where: { email: user.email } });
    if (exist) {
      throw new Error("Already exists");
    }
    var hash = await hashPassword(user.password);
    user.password = hash;
  });

  User.addHook("beforeUpdate", async (user) => {
    var hash = await hashPassword(user.password);
    user.password = hash;
  });

  return User;
};

// sequelize.sync();

module.exports = User;
