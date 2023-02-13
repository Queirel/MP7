const { product } = require("../models");
const { transaction } = require("../models");
const { user } = require("../models");
require('dotenv').config()

// Is admin
const isAdmin = (req, res, next) => {
    try {
        const user_role = req.user.user_role
        if (user_role == 'admin') {
            next()
        }
        else {
            res.status(401).json({ forbidden: 'you dont have access' })
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Its your product
const isUserProductOrAdmin = async (req, res, next) => {
    try {
        const product_id = req.params.id
        const user_id = req.user.id
        const getProduct = await product.findOne({ where: { id: product_id } })
        const getUser = await user.findOne({ where: { id: user_id } })
        if (getProduct) {
            const prod_user_id = getProduct.prod_user_id
            if (user_id == prod_user_id || getUser.user_role == "admin") {
                next()
            }
            else {
                res.status(401).json({ forbidden: 'you do not have access' })
            }
        }
        else {
            res.status(404).json({ forbidden: 'the product does not exists' })
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Its your transaction or u r admin
const isUserTransactionOrAdmin = async (req, res, next) => {
    try {
        if (req.user.user_role == 'admin') {
            next()
        }
        else {
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
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = {
    isAdmin,
    isUserProductOrAdmin,
    isUserTransactionOrAdmin,
}