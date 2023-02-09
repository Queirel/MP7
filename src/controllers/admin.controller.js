const { transaction } = require("../models")
const { user } = require("../models")

// Get user by id
const getUserByIdAdmin = async (req, res) => {
    try {
    const getUsers = await user.findAll({ offset: 1, limit: 7 })
    res.status(200).json(getUsers)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get all users
const getAllUsersAdmin = async (req, res) => {
    try {
    const getUsers = await user.findAll({ offset: 1, limit: 7 })
    res.status(200).json(getUsers)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get all transactions
const getAllTransactionsAdmin = async (req, res) => {
    try {
        const getTransactions = await transaction.findAll({ offset: 1, limit: 10 })
        res.status(200).json(getTransactions)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Create Transaction
const saveTransactionAdmin  = async (req, res) => {
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


// Save a product
// Check admin (next)
const saveProductAdmin = async (req, res) => {
    try {
        const user_id = req.user.id
        const { prod_name, prod_price, prod_stock, prod_category } = req.body
        const saveProduct = await product.create({
            prod_name,
            prod_user_id: user_id,
            prod_price,
            prod_stock,
            prod_category
        })
        res.status(200).json(saveProduct)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Update an own product
const updateProductAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const getProduct = await product.findOne({ where: { id } })
        if (getProduct) {
            const { prod_name, prod_user_id, prod_price, prod_stock, prod_category } = req.body
            await product.update({
                prod_name,
                prod_user_id,
                prod_price,
                prod_stock,
                prod_category,
            }, {
                where: { id }
            })
            res.status(200).json({ id, prod_name, prod_user_id, prod_price, prod_stock, prod_category })
        }
        else {
            res.status(404).send('Product does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


// Delete a transaction
const deleteTransactionAdmin = async (req, res) => {
    try {
        const id = req.params.id
        // const transaction = await Users.findOne({ where: { id } })
        // if (transaction) {
            await transaction.destroy({ where: { id } })
            res.status(200).json(`Transaction ${id} deleted`)
        // }
        // else {
        //     res.status(404).send('Transaction does not exists')
        // }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Update user by id
const updateUserByIdAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const getuser = await user.findOne({ where: { id } })
        if (getuser) {
            const { user_name } = req.body
            await user.update({
                user_name,
            }, { where: { id } })
            res.status(200).json({ id, user_name })
        }
        else {
            res.status(404).send('User does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Delete user by id:
const deleteUserByIdAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const getuser = await user.findOne({ where: { id } })
        if (getuser) {
            await user.destroy({ where: { id } })
            res.status(200).json(`User ${id} deleted`)
        }
        else {
            res.status(404).send('User does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

const updateTransactionAdmin = async (req, res) => {
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
    getAllUsersAdmin,
    getUserByIdAdmin,
    getAllTransactionsAdmin,
    saveTransactionAdmin,
    saveProductAdmin,
    updateProductAdmin,
    updateUserByIdAdmin,
    updateTransactionAdmin,
    deleteTransactionAdmin,
    deleteUserByIdAdmin
}