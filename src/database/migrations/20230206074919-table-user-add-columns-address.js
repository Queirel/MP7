'use strict';

module.exports = {

  // ----------- Add colums to users table (address)

  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'user_address',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      ),
    ]);
  },


    // ----------- Delete colums

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'user_address'),
    ]);
  }
};