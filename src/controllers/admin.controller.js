const { transaction } = require("../models")
const { product } = require("../models")
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
const getAllUsers = async (req, res) => {
    try {
    const getUsers = await user.findAll({ offset: 1, limit: 7 })
    res.status(200).json(getUsers)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const getTransactions = await transaction.findAll({ offset: 1, limit: 10 })
        res.status(200).json(getTransactions)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Delete a transaction
const deleteTransaction = async (req, res) => {
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
const updateUserById = async (req, res) => {
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
const deleteUserById = async (req, res) => {
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

module.exports = {
    deleteTransaction,
    getAllTransactions,
    getAllUsers,
    updateUserById,
    deleteUserById,
    getUserByIdAdmin
}