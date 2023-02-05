const express = require('express')
const transactionsRoutes = require('./src/routes/transactions.routes')
const productsRoutes = require('./src/routes/products.routes')
const userRoutes = require('./src/routes/users.routes')
const loginRoutes = require('./src/routes/sign.routes')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Routes
app.use('/sign', loginRoutes)
app.use('/users', userRoutes)
app.use('/products', productsRoutes)
app.use('/transactions', transactionsRoutes)

module.exports = app