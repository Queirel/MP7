const { transaction } = require("../models")
const { product } = require("../models")

// Get own transactions
const getOwnTransactions = async (req, res) => {
    try {
        const trans_buy_user_id = req.user.id
        const getTransactions = await transaction.findAll({where:{trans_buy_user_id}, offset: 1, limit: 7 })
        res.status(200).json(getTransactions)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Create a transaction
const saveTransaction = async (req, res) => {
    try {
        const { trans_prod_id, trans_prod_quantity } = req.body
        const user_id = req.user.id
        const getProduct = await product.findOne({ where: { id: trans_prod_id } })
        const prod_user_id = getProduct.prod_user_id
        console.log(user_id, prod_user_id)
        if (user_id == prod_user_id) {
            res.status(401).json('u cant buy your own product')
        }
        else {
            const getTransaction = await transaction.create({
                trans_prod_id,
                trans_prod_quantity,
                trans_buy_user_id: user_id,
            })
            res.status(200).json(getTransaction)
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get own transaction
const getTransaction = async (req, res) => {
    try {
        const id = req.params.id
        const getTransaction = await transaction.findOne({ where: { id } })
        // if (getTransaction) {
            res.status(200).json(getTransaction)
        // }
        // else {
        //     res.status(404).send('Transaction does not exists')
        // }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Cancel transaction
const cancelTransaction = async (req, res) => {
    try {
        const id = req.params.id
        // const getTransaction = await transaction.findOne({ where: { id } })
        // if (getTransaction) {
            await transaction.update({
                trans_cancel: true,
            }, {
                where: { id }
            })
            res.status(200).json(`Transaction ${id} cancelled`)
        }
        // else {
        //     res.status(404).send('Transaction does not exists')
        // }
    // }
    catch (error) {
        res.status(500).json({ error })
    }
}


module.exports = {
    getTransaction,
    saveTransaction,
    getOwnTransactions,
    cancelTransaction
}

