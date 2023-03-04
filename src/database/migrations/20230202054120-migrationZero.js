'use strict';

module.exports = {

      // ------- Create tables (users, products, transactions) -------------


  up: async (queryInterface, Sequelize) => {
    return Promise.all([


      // ------------------- Users table ----------------------

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
        },
        user_role: {
          type: Sequelize.ENUM('admin', 'user'),
          allowNull: false,
          default: 'user'
        },
        user_password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }),


      // ------------------- Products table ----------------------

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
        },
        prod_user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        prod_price: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        prod_stock: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        prod_category: {
          type: Sequelize.ENUM('agro','fashion','food','home','tecnology', 'tools', 'toys'),
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
      }),


      // ------------------- Transactions table ----------------------

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
          references: {
            model: 'users',
            key: 'id'
          }
        },
        trans_prod_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
        },
        trans_prod_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
      })
    ])
  },


  // ---------------- delete tables ---------------------

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.dropTable('transactions'),
      await queryInterface.dropTable('products'),
      await queryInterface.dropTable('users'),
    ])
  }
};
