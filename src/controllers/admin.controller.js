const { passwordHash } = require("../helpers/bcrypt")
const { transaction } = require("../models")
const { user } = require("../models")
const { product } = require("../models")

// Get user by id
const getUserByIdAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const getUser = await user.findOne({ where: { id } })
        res.status(200).json({ "User": getUser })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


// Get all users
const getAllUsersAdmin = async (req, res) => {
    try {
        const { offset, limit } = req.body
        const getUsers = await user.findAll({ offset: offset, limit: limit })
        res.status(200).json({ "Users": getUsers })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get all transactions
const getAllTransactionsAdmin = async (req, res) => {
    try {
        const { limit, offset } = req.body
        const getTransactions = await transaction.findAll({ offset: offset, limit: limit })
        res.status(200).json(getTransactions)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Create Transaction
const saveTransactionAdminStockControl = async (req, res) => {
    try {
        const { trans_prod_id, trans_prod_quantity, trans_cancel, trans_buy_user_id } = req.body
        const getProduct = await product.findOne({ where: { id: trans_prod_id } })
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
                        trans_cancel,
                        trans_prod_id,
                        trans_prod_quantity,
                        trans_buy_user_id
                    })
                    await product.update({
                        prod_published: false,
                        prod_stock: NewStock
                    }, { where: { id: trans_prod_id } })
                    res.status(200).json({
                        "Message": "Out of stock, product paused","Transaction":getTransaction})
                }
                else {
                    const NewStock = getProduct.dataValues.prod_stock - trans_prod_quantity
                    console.log(NewStock)
                    const getTransaction = await transaction.create({
                        trans_cancel,
                        trans_prod_id,
                        trans_prod_quantity,
                        trans_buy_user_id,
                    })
                    await product.update({
                        prod_stock: NewStock
                    }, { where: { id: trans_prod_id } })
                    res.status(200).json({
                        "Remaining product quantity": NewStock,"Transaction":getTransaction})
                }
            }
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Save a product
const saveProductAdmin = async (req, res) => {
    try {
        const { prod_name, prod_price, prod_stock, prod_category, prod_published, prod_user_id } = req.body
        const saveProduct = await product.create({
            prod_name,
            prod_user_id,
            prod_price,
            prod_stock,
            prod_category,
            prod_published
        })
        res.status(200).json(saveProduct)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Update any product
const updateProductAdmin = async (req, res) => {
    try {
        const product_id = req.params.id
        const getProduct = await product.findOne({ where: { id: product_id } })
        const { 
            prod_name, 
            prod_price, 
            // prod_stock, 
            prod_user_id,
            prod_category, 
            prod_published 
        } = req.body
        if (!prod_name) {
            getProd_name = getProduct.dataValues.prod_name
        }
        else {
            getProd_name = prod_name
        }
        if (!prod_price) {
            getProd_price = getProduct.dataValues.prod_price
        }
        else {
            getProd_price = prod_price
        }
        if (!prod_user_id) {
            getProd_user_id = getProduct.dataValues.prod_user_id
        }
        else {
            getProd_user_id = prod_user_id
        }
        // if (!prod_stock) {
        //     getProd_stock = getProduct.dataValues.prod_stock
        // }
        // else {
        //     getProd_stock = prod_stock
        // }
        if (!prod_category) {
            getProd_category = getProduct.dataValues.prod_category
        }
        else {
            getProd_category = prod_category
        }
        if (!prod_published) {
            getProd_published = getProduct.dataValues.prod_published
        }
        else {
            getProd_published = prod_published
        }
        await product.update({
            prod_name: getProd_name,
            prod_price: getProd_price,
            // prod_stock: getProd_stock,
            prod_category: getProd_category,
            prod_user_id: getProd_user_id,
            prod_published: getProd_published
        }, {
            where: { id: product_id }
        })
        res.status(200).json({
            "Id": product_id,
            "Product name": getProd_name,
            "Product price": getProd_price,
            "Product stock": getProd_stock,
            "User owner": getProd_user_id,
            "Product category": getProd_category,
            "Product published": getProd_published
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


// Delete a transaction by id
const deleteTransactionAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const getTransaction = await transaction.destroy({ where: { id } })
        if (getTransaction) {
            res.status(200).json(`Transaction ${id} deleted`)
        }
        else {
            res.status(404).json('Transaction does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Update user by id
const updateUserByIdAdmin = async (req, res) => {
    try {
    const id = req.params.id
    const getUser = await user.findOne({ where: { id } })
    if (getUser) {
        const { user_name, user_password, user_realname, user_lastname, user_dni, user_role, user_birthdate } = req.body
        if (!user_name) {
            getUser_name = getUser.dataValues.user_name
        }
        else {
            getUser_name = user_name
        }
        if (!user_password) {
            getUser_password = getUser.dataValues.user_password
        }
        else {
            getUser_password = user_password
        }
        if (!user_realname) {
            getUser_realname = getUser.dataValues.user_realname
        }
        else {
            getUser_realname = user_realname
        }
        if (!user_lastname) {
            getUser_lastname = getUser.dataValues.user_lastname
        }
        else {
            getUser_lastname = user_lastname
        }
        if (!user_dni) {
            getUser_dni = getUser.dataValues.user_dni
        }
        else {
            getUser_dni = user_dni
        }
        if (!user_role) {
            getUser_role = getUser.dataValues.user_role
        }
        else {
            getUser_role = user_role
        }
        if (!user_birthdate) {
            getUser_birthdate = getUser.dataValues.user_birthdate
        }
        else {
            getUser_birthdate = user_birthdate
        }
        const passHash = await passwordHash(getUser_password)
        await user.update({
            user_name: getUser_name,
            user_realname: getUser_realname,
            user_lastname: getUser_lastname,
            user_dni: getUser_dni,
            user_birthdate: getUser_birthdate,
            user_password: passHash,
            user_role: getUser_role,
        }, { where: { id } })
        res.status(200).json({
            id,
            "User name": getUser_name,
            "Name": getUser_realname,
            "Lastname": getUser_lastname,
            "DNI": getUser_dni,
            "Role": getUser_role,
            "Password": passHash,
            "Birthdate": getUser_birthdate
        })
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
        const {  trans_cancel } = req.body
        const getTransaction = await transaction.findOne({ where: { id } })
        if (getTransaction) {
            if (!trans_cancel) {
                getTrans_cancel = getTransaction.trans_cancel
            }
            else {
                getTrans_cancel = trans_cancel
            }
            await transaction.update({
                trans_cancel: getTrans_cancel,
            }, {
                where: { id }
            })
            res.status(200).json({getTransaction})
        }
        else {
            res.status(404).send('Transaction does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = {
    getAllUsersAdmin,
    getUserByIdAdmin,
    getAllTransactionsAdmin,
    saveTransactionAdminStockControl,
    saveProductAdmin,
    updateProductAdmin,
    updateUserByIdAdmin,
    updateTransactionAdmin,
    deleteTransactionAdmin,
    deleteUserByIdAdmin
}