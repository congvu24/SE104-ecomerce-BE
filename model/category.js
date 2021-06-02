var { Sequelize, DataTypes } = require("sequelize");

const Category = (sequelize) => {
  class Category extends Sequelize.Model {}

  Category.init(
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
    },
    {
      sequelize,
      modelName: "categories",
    }
  );

  Category.associate = ({ models }) => {
    Category.hasMany(models.products, {
      foreignKey: "category_id",
    });
  };

  return Category;
};

// sequelize.sync();

module.exports = Category;
