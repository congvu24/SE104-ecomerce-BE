var { Sequelize, DataTypes } = require("sequelize");

const CartItem = (sequelize) => {
  class CartItem extends Sequelize.Model {}

  CartItem.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cart_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      variant_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "cart_items",
    }
  );

  CartItem.associate = ({ models }) => {
    CartItem.belongsTo(models.user_carts, {
      foreignKey: "cart_id",
      targetKey: "id",
    });
    CartItem.belongsTo(models.products, {
      foreignKey: "product_id",
      targetKey: "id",
    });
    CartItem.belongsTo(models.product_variants, {
      foreignKey: "variant_id",
      targetKey: "id",
    });
  };

  return CartItem;
};

// sequelize.sync();

module.exports = CartItem;
