var { Sequelize, DataTypes } = require("sequelize");

const Address = (sequelize) => {
  class Address extends Sequelize.Model {}

  Address.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
      },
      phone: {
        type: Sequelize.DataTypes.STRING,
      },
      address: { type: Sequelize.DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "user_addresses",
    }
  );

  Address.associate = ({ models }) => {
    Address.belongsTo(models.users, {
      foreignKey: "user_id", // column in this table
      targetKey: "id", // column in another table
    });
  };

  return Address;
};

// sequelize.sync();

module.exports = Address;
