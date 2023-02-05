const { user } = require("../models")

// Get all users
const getUsers = async (req, res) => {
    try {
    const getUsers = await user.findAll()
    res.status(200).json(getUsers)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Get one user by id
const getUser = async (req, res) => {
    try {
    const id = req.params.id
    const getUser = await user.findOne({ where: { id } })
    if (getUser) {
        res.status(200).json(getUser)
    }
    else {
        res.status(404).send('User does not exists')
    }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Update User
const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const getuser = await user.findOne({ where: { id } })
        if (getuser) {
            const { user_name, user_role } = req.body
            await user.update({
                user_name,
                user_role
            }, { where: { id } })
            res.status(200).json({ id, user_name, user_role })
        }
        else {
            res.status(404).send('User does not exists')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Delete User:
const deleteUser = async (req, res) => {
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
    getUsers,
    getUser,
    updateUser,
    deleteUser
}