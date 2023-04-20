'use strict';

module.exports = {

  // ----------- Add colum to products table (image)
  up: async (queryInterface, Sequelize) => {
    
     await queryInterface.addColumn('users','user_customer_id',{
      type: Sequelize.STRING,
      allowNull: false
    }
    );
  },


      // ----------- Delete colums

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.removeColumn('users',
    'user_customer_id');
    
  }
};
