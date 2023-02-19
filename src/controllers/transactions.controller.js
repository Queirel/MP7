const { transaction } = require("../models")
const { product } = require("../models")

// Get own transactions
const getOwnTransactions = async (req, res) => {
    try {
        const trans_buy_user_id = req.user.id
        const { limit, offset } = req.body
        const getTransactions = await transaction.findAll({ where: { trans_buy_user_id }, offset: offset, limit: limit })
        res.status(200).json(getTransactions)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get own transaction by id
const getTransactionById = async (req, res) => {
    try {
        const id = req.params.id
        const getTransaction = await transaction.findOne({ where: { id } })
        if (getTransaction) {
            res.status(200).json(getTransaction)
        }
        else {
            res.status(404).send('Transaction does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Create a transaction and control the stock
const createTransactionAndStockControl = async (req, res) => {
    try {
        const { trans_prod_id, trans_prod_quantity } = req.body
        const user_id = req.user.id
        const getProduct = await product.findOne({ where: { id: trans_prod_id } })
        const prod_user_id = getProduct.prod_user_id
        if (user_id == prod_user_id) {
            res.status(401).json('You cant buy your own product')
        }
        else {
            if (!getProduct.dataValues.prod_published) {
                res.status(400).json({ "Error": "You cant buy a paused product" })
            }
            else {
                if (trans_prod_quantity < 1) {
                    res.status(404).json({ "Error": "Quantity must be more than 0" })
                }
                else {
                    if (trans_prod_quantity > getProduct.dataValues.prod_stock) {
                        res.status(404).json({ "Error": "Quantity exceeds stock" })
                    }
                    else if (trans_prod_quantity == getProduct.dataValues.prod_stock) {
                        const NewStock = getProduct.dataValues.prod_stock - trans_prod_quantity
                        const getTransaction = await transaction.create({
                            trans_prod_id,
                            trans_prod_quantity,
                            trans_buy_user_id: user_id,
                        })
                        await product.update({
                            prod_published: false,
                            prod_stock: NewStock
                        }, { where: { id: trans_prod_id } })
                        res.status(200).json({
                            "Message": "Out of stock, product paused",
                            "Transaction id": getTransaction.id,
                            "User": user_id,
                            "Product": trans_prod_id,
                            "Quantity": trans_prod_quantity
                        })
                    }
                    else {
                        const NewStock = getProduct.dataValues.prod_stock - trans_prod_quantity
                        console.log(NewStock)
                        const getTransaction = await transaction.create({
                            trans_prod_id,
                            trans_prod_quantity,
                            trans_buy_user_id: user_id,
                        })
                        await product.update({
                            prod_stock: NewStock
                        }, { where: { id: trans_prod_id } })
                        res.status(200).json({
                            "Remaining product quantity": NewStock,
                            "Transaction id": getTransaction.id,
                            "User": user_id,
                            "Product": trans_prod_id,
                            "Quantity": trans_prod_quantity
                        })
                    }
                }
            }
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Cancel own transaction by id
const cancelTransactionById = async (req, res) => {
    try {
        const id = req.params.id
        const getTransaction = await transaction.findOne({ where: { id } })
        if (getTransaction) {
            if (getTransaction.trans_cancel) {
                res.status(200).json(`Transaction ${id} is already cancelled`)
            }
            else {
                await transaction.update({
                    trans_cancel: true,
                }, {
                    where: { id }
                })
                res.status(200).json(`Transaction ${id} cancelled`)
            }
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


module.exports = {
    getTransactionById,
    getOwnTransactions,
    createTransactionAndStockControl,
    cancelTransactionById
}