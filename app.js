// Express app
const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require( 'express-fileupload')

// Import Routes
const transactionsRoutes = require('./src/routes/transactions.routes')
const productsRoutes = require('./src/routes/products.routes')
const userRoutes = require('./src/routes/users.routes')
const loginRoutes = require('./src/routes/auth.routes')
const adminRoutes = require('./src/routes/admin.routes')
const filesRoutes = require('./src/routes/files.routes')
const stripeRoutes = require('./src/routes/stripe.routes')

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/helpers/swagger')
const swaggerJsDoc = require('swagger-jsdoc');

// Middlewares
app.use(cors())
app.use(express.json({limit: '25mb'}))
app.use(express.urlencoded({ extended: false, limit: '25mb' }))
app.use(fileUpload({useTempFiles: true, tempFileDir: './uploads' }))
app.use(express.static('images'))


// Routes
app.use('/admin', adminRoutes)
app.use('/sign', loginRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use('/transactions', transactionsRoutes)
app.use('/files', filesRoutes)
app.use('/stripe', stripeRoutes)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));


module.exports = app