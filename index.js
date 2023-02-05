require('dotenv').config()

const app = require('./app');
const port = process.env.PORT || 3000
const { sequelize } = require('./src/models')

app.listen(port, async () => {
    console.log(`Server on port ${port}`)

    try {
        await sequelize.authenticate();
        console.log('Database connection established.');
    } catch (e) {
        console.log('Database connection failed', e);
    }
})