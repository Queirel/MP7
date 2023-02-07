'use strict';

module.exports = {

  // ----------- Add colum to products table (published)
  up: async (queryInterface, Sequelize) => {
    
     await queryInterface.addColumn('products','prod_published',{
      type: Sequelize.BOOLEAN,
      default: true,
      allowNull: false
    }

    );
  },


      // ----------- Delete colums

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.removeColumn('products',
    'prod_published');
    
  }
};
