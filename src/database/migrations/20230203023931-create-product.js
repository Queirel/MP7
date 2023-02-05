'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prod_name: {
        type: Sequelize.STRING,
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
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'users',
          key: 'id'
        }
      },
      prod_price: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: 1,
            msg: "there has to be at least 1"
          }
        }
      },
      prod_category: {
        type: Sequelize.ENUM('electronics', 'toys', 'tools', 'fashion'),
        allowNull: false
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
    await queryInterface.dropTable('products');
  }
};