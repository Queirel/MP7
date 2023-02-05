'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [{
      prod_name: 'prod',
      prod_user_id: 1,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      prod_name: 'prod1',
      prod_user_id: 1,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      prod_name: 'prod2',
      prod_user_id: 2,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      prod_name: 'prod3',
      prod_user_id: 3,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      prod_name: 'prod4',
      prod_user_id: 4,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      prod_name: 'prod5',
      prod_user_id: 5,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      prod_name: 'prod6',
      prod_user_id: 2,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    {
      prod_name: 'prod7',
      prod_user_id: 3,
      prod_price: 123,
      prod_stock: 12,
      prod_category: 'toys',
      createdAt: new Date(),
      updatedAt: new Date(),
    },


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('products', null, {});
   
  }
};
