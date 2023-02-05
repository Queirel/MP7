'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.transaction, {
        foreignKey: 'id'
      }),
        user.hasMany(models.product, {
          foreignKey: 'id'
        })
    }
  };
  user.init({
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 255],
          msg: "User name lenght must be between 2 and 255 characters"
        }
      }
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
      len: {
        args: [2, 255],
        msg: "Password must be between 2 and 255 characters"
      }
    },
    user_role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};