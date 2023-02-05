'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    static associate(models) {
      product.hasMany(models.transaction, {
        foreignKey: 'id'
      }),
        product.belongsTo(models.user, {
          foreignKey: 'id',
          sourceKey: 'prod_user_id'
        })
    }
  };
  product.init({
    prod_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          args: true,
          msg: "must be only letters"
        }
      },
      defaultValue: 1
    },
    prod_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prod_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "must be more than 0"
        },
      },
      defaultValue: 1
    },
    prod_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: "there has to be at least 1"
        }
      }
    },
    prod_category: {
      type: DataTypes.ENUM('electronics', 'toys', 'tools', 'fashion'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};