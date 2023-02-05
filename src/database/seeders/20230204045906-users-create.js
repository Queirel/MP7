'use strict';

const { passwordHash } = require("../../utils/bcrypt");

module.exports = {
   up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('users', [{
         user_name: 'fede',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede1',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede2',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede3',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede4',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede5',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede6',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede7',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede8',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede9',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede10',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede11',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede12',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fed13',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      {
         user_name: 'fede14',
         user_password: await passwordHash('pass'),
         user_role: 'superadmin',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
      ], {});
   },

   down: async (queryInterface, Sequelize) => {

      await queryInterface.bulkDelete('users', null, {});

   }
};
