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
      image: {
        type: Sequelize.DataTypes.STRING,
      }
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

  Category.addHook("afterFind", async (result, cb) => {
    if (result.constructor === Array) {
      var arrayLength = result.length;
      for (var i = 0; i < arrayLength; i++) {
        if(result[i].image != null)
        result[i].dataValues.image = "/image/category/" + result[i].image;
      }
    } else {
      result.dataValues.image = "/image/category/" + result.image;
    }
    return result;
  });

  return Category;
};

// sequelize.sync();

module.exports = Category;
