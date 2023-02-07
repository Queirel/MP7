'use strict';

module.exports = {

  // ----------- Add colums to users table (real name, lastname, dni, birthdate)

  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'user_realname',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'users',
        'user_lastname',
        {
          type: Sequelize.STRING,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'users',
        'user_dni',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'users',
        'user_birthdate',
        {
          type: Sequelize.DATE,
          allowNull: false
        }
      ),
    ]);
  },


    // ----------- Delete colums

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'user_realname'),
      queryInterface.removeColumn('users', 'user_lastname'),
      queryInterface.removeColumn('users', 'user_dni'),
      queryInterface.removeColumn('users', 'user_birthdate'),
    ]);
  }
};