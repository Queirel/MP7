/** @format */

"use strict";

module.exports = {
  // ----------- Add colums to users table (real name, lastname, dni, email)

  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("users", "user_realname", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn("users", "user_lastname", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn("users", "user_dni", {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.addColumn("users", "user_email", {
        type: Sequelize.STRING,
        allowNull: false,
        isUnique: true,
        validate: {
          isEmail: true,
        },
      }),
    ]);
  },

  // ----------- Delete colums

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("users", "user_realname"),
      queryInterface.removeColumn("users", "user_lastname"),
      queryInterface.removeColumn("users", "user_dni"),
      queryInterface.removeColumn("users", "user_email"),
    ]);
  },
};
