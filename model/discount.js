var { Sequelize, DataTypes } = require("sequelize");


const Discount = (sequelize) => {
  class Discount extends Sequelize.Model {}

  Discount.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      percentage: {
        type: Sequelize.DataTypes.FLOAT,
      },
      code: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      exp: {
        type: Sequelize.DataTypes.DATE,
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      max: {
        type: Sequelize.DataTypes.FLOAT,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: "discounts",
    }
  );

  return Discount;
};

// sequelize.sync();

module.exports = Discount;
