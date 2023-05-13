require('dotenv').config()

const app = require('./app');
const logger = require('./src/helpers/logger');
const port = process.env.PORT || 3000
const { sequelize } = require('./src/models');


// Listen
app.listen(port, async () => {
    try {
        console.log(`Server started on port ${port}`)
        logger.info(`Server started on port ${port}`, {name: "jhon"})
        await sequelize.authenticate();
        throw new Error('new error has been throwed')
        console.log('Database connection established');
        logger.info('Database connection established',{data: "errori"});
    } catch (error) {
        console.log('Database connection failed:', error);
        logger.error('Database connection failed:', error, {name: "errori"});
    }
})