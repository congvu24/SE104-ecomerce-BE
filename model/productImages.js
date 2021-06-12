var { Sequelize, DataTypes } = require("sequelize");

const ProductImage = (sequelize) => {
  class ProductImage extends Sequelize.Model {}

  ProductImage.init(
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "product_images",
    }
  );

  ProductImage.associate = ({ models }) => {
    ProductImage.belongsTo(models.products, {
      foreignKey: "product_id",
      targetKey: "id",
    });
  };

  ProductImage.addHook("afterFind", async (result, cb) => {
    if (result.constructor === Array) {
      var arrayLength = result.length;
      for (var i = 0; i < arrayLength; i++) {
        result[i].dataValues.link = "/image/" + result[i].name;
      }
    } else {
      result[i].dataValues.link = "/image/" + result[i].name;
    }
    return result;
  });

  return ProductImage;
};

// sequelize.sync();

module.exports = ProductImage;
