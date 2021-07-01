var { Sequelize, DataTypes } = require("sequelize");

const ShippingMethod = (sequelize) => {
  class ShippingMethod extends Sequelize.Model {}

  ShippingMethod.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      fee: {
        type: Sequelize.DataTypes.FLOAT,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: "shipping_methods",
    }
  );

  return ShippingMethod;
};

// sequelize.sync();

module.exports = ShippingMethod;
