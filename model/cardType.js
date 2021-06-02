var { Sequelize, DataTypes } = require("sequelize");

const CardType = (sequelize) => {
  class CardType extends Sequelize.Model {}

  CardType.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.DataTypes.INTEGER,
      },
      fee: {
        type: Sequelize.DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "card_types",
    }
  );

  return CardType;
};

// sequelize.sync();

module.exports = CardType;
