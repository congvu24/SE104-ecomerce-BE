var { Sequelize, DataTypes } = require("sequelize");

const Cart = (sequelize) => {
  class Cart extends Sequelize.Model {}

  Cart.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DataTypes.FLOAT,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
      },
      address: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      discount_id: {
        type: Sequelize.DataTypes.INTEGER,
      },
      shipping_method_id: {
        type: Sequelize.DataTypes.INTEGER,
      },
      card_id: {
        type: Sequelize.DataTypes.INTEGER,
      }
    },
    {
      sequelize,
      modelName: "user_carts",
    }
  );

  Cart.associate = ({ models }) => {
    Cart.belongsTo(models.users, {
      foreignKey: "user_id",
      targetKey: "id",
    });
    Cart.belongsTo(models.discounts, {
      foreignKey: "discount_id",
      targetKey: "id",
    });
    Cart.belongsTo(models.shipping_methods, {
      foreignKey: "shipping_method_id",
      targetKey: "id",
    });
  };

  return Cart;
};

// sequelize.sync();

module.exports = Cart;
