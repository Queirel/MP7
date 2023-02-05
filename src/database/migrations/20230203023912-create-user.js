'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
    },
  
    user_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 255],
          msg: "User name lenght must be between 2 and 255 characters"
        }
      }
    },
    user_role: {
      type: Sequelize.ENUM('admin', 'user'),
      allowNull: false
    },
    user_password: {
      type: Sequelize.STRING,
      allowNull: false,
      len: {
        args: [2, 255],
        msg: "Password must be between 2 and 255 characters"
      }
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};