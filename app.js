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

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/helpers/swagger')
const swaggerJsDoc = require('swagger-jsdoc');

// Middlewares
app.use(cors())
app.use(express.json({limit: '25mb'}))
app.use(express.urlencoded({ extended: false, limit: '25mb' }))
app.use(fileUpload(
    {useTempFiles: true, tempFileDir: './dev/uploads' }
    ))
// app.use(express.static('images'))

// Routes
app.use('/admin', adminRoutes)
app.use('/sign', loginRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use('/transactions', transactionsRoutes)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));

// DEV
const filesRoutes = require('./src/dev/routes/files.routes')
const geocodeRoutes = require('./src/dev/routes/geocode.routes')
const stripeRoutes = require('./src/dev/routes/stripe.routes')
app.use('/files', filesRoutes)
app.use('/stripe', stripeRoutes)
app.use('/geocode', geocodeRoutes)


module.exports = app