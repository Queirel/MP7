const express = require('express')
// Import Routes
const transactionsRoutes = require('./src/routes/transactions.routes')
const productsRoutes = require('./src/routes/products.routes')
const userRoutes = require('./src/routes/users.routes')
const loginRoutes = require('./src/routes/auth.routes')
const adminRoutes = require('./src/routes/admin.routes')
const authentication = require('./src/middleware/authentication')
const { isAdmin } = require('./src/middleware/authorization')

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/utils/swagger')
const swaggerJsDoc = require('swagger-jsdoc');
// App
const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));

// Routes
app.use('/sign', loginRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use('/transactions', transactionsRoutes)
app.use('/admin', adminRoutes)

module.exports = app