const express = require('express')
const transactionsRoutes = require('./src/routes/transactions.routes')
const productsRoutes = require('./src/routes/products.routes')
const userRoutes = require('./src/routes/users.routes')
const loginRoutes = require('./src/routes/sign.routes')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/utils/swagger')
const swaggerJsDoc = require('swagger-jsdoc');
const app = express()

// const path = require('path')
// const swaggerSpec = {
//     definition:{
//         openapi: "3.0.0",
//         info:{
//             title: "Marketplace",
//             version: "1.0.0"
//         },
//         servers:[{
//             url: "http://localhost:3000"
//         }]
//     },
//     apis:[`${path.join(__dirname, "./src/routes/*.js")}`]
// }

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));

//Routes
app.use('/sign', loginRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use('/transactions', transactionsRoutes)

module.exports = app