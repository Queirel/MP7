const { user } = require("../models")
const jwt = require("jsonwebtoken")
const { passwordHash, passwordCompare } = require("../helpers/bcrypt")

// Get user by Id
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

// Update own User
const updateOwnUser = async (req, res) => {
    try {
        const id = req.user.id
        const getUser = await user.findOne({ where: { id } })
        const { user_name, user_realname, user_lastname, user_dni, user_birthdate } = req.body
        if (!user_name) {
            getUser_name = getUser.dataValues.user_name
        }
        else {
            getUser_name = user_name
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
        if (!user_birthdate) {
            getUser_birthdate = getUser.dataValues.user_birthdate
        }
        else {
            getUser_birthdate = user_birthdate
        }
        await user.update({
            user_name: getUser_name,
            user_realname: getUser_realname,
            user_lastname: getUser_lastname,
            user_dni: getUser_dni,
            user_birthdate: getUser_birthdate,
        }, { where: { id } })
        res.status(200).json({
            id,
            "User name": getUser_name,
            "Name": getUser_realname,
            "Lastname": getUser_lastname,
            "DNI": getUser_dni,
            "Birthdate": getUser_birthdate
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Delete own User
const deleteOwnUser = async (req, res) => {
    try {
        const id = req.user.id
        if (req.user.user_role == 'admin') {
            res.status(403).json(`You can't delete an admin account`)
        }
        else {
            await user.destroy({ where: { id } })
            res.status(200).json(`User deleted`)
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Password change
const updateOwnUserPassword = async (req, res) => {
    try {
        const id = req.user.id
        const getUser = await user.findOne({ where: { id } })
        const { oldPassword, newPassword } = req.body
        if (!oldPassword || !newPassword) {
            res.status(404).json("You must fill the fields")
        }
        else {
            const passCompare = await passwordCompare(oldPassword, getUser.user_password)
            if (passCompare) {
                if (oldPassword == newPassword) {
                    res.status(404).json("New password cannot be the same as the old one")
                }
                else {
                    const passHash = await passwordHash(newPassword)
                    await user.update({
                        user_password: passHash,
                    }, { where: { id } })
                    res.status(200).json("Password has been changed")
                }
            }
            else {
                res.status(404).json("Incorrect password")
            }
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


module.exports = {
    getUserById,
    updateOwnUser,
    deleteOwnUser,
    updateOwnUserPassword
}