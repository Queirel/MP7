'use strict';

module.exports = {

  // ----------- Add colum to products table (image)
  up: async (queryInterface, Sequelize) => {
    
     await queryInterface.addColumn('products','prod_image',{
      type: Sequelize.STRING,
      allowNull: true
    }
    );
  },


      // ----------- Delete colums

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.removeColumn('products',
    'prod_image');
    
  }
};
