require('dotenv').config()

module.exports = {

  //Database config
  development:{
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB || 'database_development2',
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_DIALECT || 'postgres',
  },
  //Seeds config
  seederStorage: 'sequelize',
  seederStorageTableName: 'seeds',

  // Migrate config
  migrateStorage: 'sequelize',
  migrateStorageTableName: 'migrations'

}