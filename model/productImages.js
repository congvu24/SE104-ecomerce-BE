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
  return ProductImage;
};

// sequelize.sync();

module.exports = ProductImage;
