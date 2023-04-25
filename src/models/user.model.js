/** @format */

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.transaction, {
        foreignKey: "id",
      }),
        user.hasMany(models.product, {
          foreignKey: "id",
        });
    }
  }
  user.init(
    {
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      user_password: {
        type: DataTypes.STRING,
      },
      user_role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
      user_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_realname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        isUnique: true,
        validate: {
          isEmail: true,
        },
      },
      user_customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_dni: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
