const { user } = require("../models")

// Get one user by id
const getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const getUser = await user.findOne({ where: { id } })
        if (getUser) {
            res.status(200).json({ "User name": getUser.user_name })
        }
        else {
            res.status(404).send('User does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Update own user
const updateOwnUser = async (req, res) => {
    try {
        const id = req.user.id
        const { user_name, name, user_email } = req.body
        await user.update({
            user_name,
            name,
            user_email
        }, { where: { id } })
        res.status(200).json({ id, user_name, name, user_email })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Delete own user:
const deleteOwnUser = async (req, res) => {
    try {
        const id = req.user.id
        await user.destroy({ where: { id } })
        res.status(200).json(`User deleted`)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = {
    getUserById,
    updateOwnUser,
    deleteOwnUser
}