require('dotenv').config()
const logger = require("../helpers/logger");
const { product } = require("../models");
const { transaction } = require("../models");
// const { user } = require("../models");

// Is admin
const isAdmin = (req, res, next) => {
    try {
        const user_role = req.user.user_role
        if (user_role == 'admin') {
            // logger.info(`User ${req.user.id} (Admin) authenticated successfully`)
            next()
        }
        else {
            res.status(401).json({ 'Forbidden': 'you dont have access' })
        }
    }
    catch (error) {
        logger.error(`middl-isAdmin - Error (500): ${error.message}`)
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

// Its your product
const isUserProduct = async (req, res, next) => {
    try {
        const product_id = req.params.id
        if (/[^0-9]/.test(product_id)) {
            return res.status(400).json({ "Error": "Product id must be an integer" })
        }
        const user_id = req.user.id
        const getProduct = await product.findOne({ where: { id: product_id } })
        if (!getProduct) {
            return res.status(400).json({ "Error": "Product does not exist" })

        }
        const prod_user_id = getProduct.prod_user_id
        if (user_id !== prod_user_id) {
            return res.status(401).json({ "Forbidden": 'you do not have access' })
        }

        return next()


    }
    catch (error) {
        logger.error(`middl-isUserProduct - Error (500): ${error.message}`)
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

// Its your transaction
const isUserTransaction = async (req, res, next) => {
    try {
        const transaction_id = req.params.id
        const user_id = req.user.id
        const getTransaction = await transaction.findOne({ where: { id: transaction_id } })
        if (getTransaction) {
            const trans_buy_user_id = getTransaction.trans_buy_user_id
            if (user_id == trans_buy_user_id) {
                next()
            }
            else {
                res.status(401).json({ forbidden: 'you do not have access' })
            }
        }
        else {
            res.status(401).json({ forbidden: 'you do not have access' })
        }
    }
    catch (error) {
        logger.error(`middl-isUserTransaction - Error (500): ${error.message}`)
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

module.exports = {
    isAdmin,
    isUserProduct,
    isUserTransaction,
}