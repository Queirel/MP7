'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    static associate(models) {
      transaction.belongsTo(models.user, {
        foreignKey: 'id',
        sourceKey: 'trans_buy_user_id'
      }),
        transaction.belongsTo(models.product, {
          foreignKey: 'id',
          sourceKey: 'trans_prod_id'
        })
    }
  };
  transaction.init({
    trans_prod_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trans_buy_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trans_prod_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    trans_cancel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};