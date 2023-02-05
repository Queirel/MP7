'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trans_buy_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'users',
          key: 'id'
        }
      },
      trans_prod_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'products',
          key: 'id',
        },
      },
      trans_prod_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: 1,
            msg: "must be more than 0"
          },
          max: 200,
        },
        defaultValue: 1
      },
      trans_cancel: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('transactions');
  }
};