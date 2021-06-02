var { Sequelize, DataTypes } = require("sequelize");

const Card = (sequelize) => {
  class Card extends Sequelize.Model {}

  Card.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
      },
      number: {
        type: Sequelize.DataTypes.STRING,
      },
      cvv: {
        type: Sequelize.DataTypes.STRING,
      },
      card_type_id: {
        type: Sequelize.DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "user_cards",
    }
  );

  Card.associate = ({ models }) => {
    Card.belongsTo(models.users, {
      foreignKey: "user_id", // column in this table
      targetKey: "id", // column in another table
    });
    Card.belongsTo(models.card_types, {
      foreignKey: "card_type_id",
      targetKey: "id",
    });
  };

  return Card;
};

// sequelize.sync();

module.exports = Card;
