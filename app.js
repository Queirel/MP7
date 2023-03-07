// Express app
const express = require('express')
const app = express()
const cors = require('cors')

// Import Routes
const transactionsRoutes = require('./src/routes/transactions.routes')
const productsRoutes = require('./src/routes/products.routes')
const userRoutes = require('./src/routes/users.routes')
const loginRoutes = require('./src/routes/auth.routes')
const adminRoutes = require('./src/routes/admin.routes')

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/helpers/swagger')
const swaggerJsDoc = require('swagger-jsdoc');

// Middlewares
app.use(express.json({limit: '25mb'}))
app.use(express.urlencoded({ extended: false, limit: '25mb' }))
app.use(cors()) 
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
app.use('/admin', adminRoutes)
app.use('/sign', loginRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use('/transactions', transactionsRoutes)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));

module.exports = app