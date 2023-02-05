'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('transactions', [{
      trans_buy_user_id: 1,
      trans_prod_id: 3,
      trans_prod_quantity: 9,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      trans_buy_user_id: 1,
      trans_prod_id: 5,
      trans_prod_quantity: 12,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      trans_buy_user_id: 1,
      trans_prod_id: 1,
      trans_prod_quantity: 19,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      trans_buy_user_id: 2,
      trans_prod_id: 3,
      trans_prod_quantity: 8,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      trans_buy_user_id: 2,
      trans_prod_id: 4,
      trans_prod_quantity: 6,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      trans_buy_user_id: 3,
      trans_prod_id: 4,
      trans_prod_quantity: 2,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      trans_buy_user_id: 3,
      trans_prod_id: 4,
      trans_prod_quantity: 11,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      trans_buy_user_id: 4,
      trans_prod_id: 4,
      trans_prod_quantity: 1,
      trans_cancel: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('transactions', null, {});
   
  }
};
