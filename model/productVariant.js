var { Sequelize, DataTypes } = require("sequelize");

const ProductVariant = (sequelize) => {
  class ProductVariant extends Sequelize.Model {}

  ProductVariant.init(
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
      stock: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "product_variants",
    }
  );

  ProductVariant.associate = ({ models }) => {
    ProductVariant.belongsTo(models.products, {
      foreignKey: "product_id",
      targetKey: "id",
    });
  };
  
  return ProductVariant;
};

// sequelize.sync();

module.exports = ProductVariant;
