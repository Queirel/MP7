const { user } = require("../models")
const jwt = require("jsonwebtoken")

// Get user by id
const getUserById = async (req, res, next) => {
    try {
    const bearerToken = req.headers['authorization']
    if (bearerToken) {
        const token = bearerToken.split(' ')[1]
        jwt.verify(token, process.env.AUTH_PASSWORD, (error, payload) => {
            req.user = payload
        })
        if (req.user.user_role == 'admin') {
            next()
        }
        else {
            const id = req.params.id
            const getUser = await user.findOne({ where: { id } })
            if (getUser) {
                res.status(200).json({ "User name": getUser.user_name })
            }
            else {
                res.status(404).send('User does not exists')
            }
        }
    }
    else {
        const id = req.params.id
        const getUser = await user.findOne({ where: { id } })
        if (getUser) {
            res.status(200).json({ "User name": getUser.user_name })
        }
        else {
            res.status(404).send('User does not exists')
        }
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
        const { user_name, user_realname, user_lastname, user_dni, user_birthdate, user_email, user_password } = req.body
        await user.update({
            user_name,
            user_realname,
            user_lastname,
            user_dni,
            user_email,
            user_birthdate,
            user_password,
        }, { where: { id } })
        res.status(200).json({
            id,
            "User name": user_name,
            "Name": user_realname,
            "Lastname": user_lastname,
            "DNI": user_dni,
            "Email": user_email,
            "Birthdate": user_birthdate
        })
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