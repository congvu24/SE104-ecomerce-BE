var { Sequelize, DataTypes } = require("sequelize");

const Product = (sequelize) => {
  class Product extends Sequelize.Model {}

  Product.init(
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
        type: Sequelize.DataTypes.TEXT,
      },
      category_id: {
        type: Sequelize.DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "products",
    }
  );

  Product.associate = ({ models }) => {
    Product.belongsTo(models.categories, {
      foreignKey: "category_id",
      targetKey: "id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    Product.hasMany(models.product_variants, {
      foreignKey: "product_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    Product.hasMany(models.product_images, {
      foreignKey: "product_id",
      onDelete: "cascade",
      onUpdate: "cascade",
      as: 'images' 
    });
  };

  return Product;
};

// sequelize.sync();

module.exports = Product;
