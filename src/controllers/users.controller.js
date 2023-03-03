const { user, product } = require("../models")
const { passwordHash, passwordCompare } = require("../helpers/bcrypt")


// Get user by Id
const getUserById = async (req, res) => {
    try {
        const id = req.params.id

        // User id conditions
        if (/[^0-9]/.test(id)) {
            return res.status(400).json({ "Error": "User id must be an integer" })
        } const getUser = await user.findOne({ where: { id } })
        if (!getUser) {
            return res.status(404).json({ "Error": "User does not exists" })
        }
        res.status(200).json({ "User name": getUser.user_name })
    }
    catch (error) {
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
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
            if (/[^a-zA-Z0-9]/.test(user_name)) {
                return res.status(400).json({ "Error": "The username must be only letters and numbers" })
            }
            if (user_name.length >= 15) {
                return res.status(400).json({ "Error": "The username must be less than 15 characters" })
            }
            if (user_name.length < 3) {
                return res.status(400).json({ "Error": "The username must be at least 3 characters" })
            }
            getUser_name = user_name
        }
        if (!user_realname) {
            getUser_realname = getUser.dataValues.user_realname
        }
        else {
            if (/[^a-zA-Z]/.test(user_realname)) {
                return res.status(400).json({ "Error": "The name must be only letters" })
            }
            if (user_realname.length >= 15) {
                return res.status(400).json({ "Error": "The name must be less than 15 characters" })
            }
            if (user_realname.length < 3) {
                return res.status(400).json({ "Error": "The name must be at least 3 letters" })
            }
            getUser_realname = user_realname
        }
        if (!user_lastname) {
            getUser_lastname = getUser.dataValues.user_lastname
        }
        else {
            if (/[^a-zA-Z]/.test(user_lastname)) {
                return res.status(400).json({ "Error": "The lastname must be only letters" })
            }
            if (user_lastname.length >= 15) {
                return res.status(400).json({ "Error": "The lastname must be less than 15 characters" })
            }
            if (user_lastname.length < 2) {
                return res.status(400).json({ "Error": "The lastname must be at least 2 letters" })
            }
            getUser_lastname = user_lastname
        }
        if (!user_dni) {
            getUser_dni = getUser.dataValues.user_dni
        }
        else {
            if (/[^0-9]/.test(user_dni)) {
                return res.status(400).json({ "Error": "DNI must be an integer" })
            }
            const dniLenght = user_dni.toString().length
            if (dniLenght < 8) {
                return res.status(400).json({ "Error": "DNI must be at least 8 numbers" })
            }
            if (dniLenght > 10) {
                return res.status(400).json({ "Error": "DNI must be at most 10 numbers" })
            }
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
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

// Delete own User
const deleteOwnUser = async (req, res) => {
    try {
        const id = req.user.id
        if (req.user.user_role == 'admin') {
            return res.status(400).json({ "Error": "You can't delete an admin account" })
        }
        const getProduct = await product.findOne({where:{prod_user_id:id}})
        if(getProduct){
            return res.status(400).json({ "Error": "User owns products, cannot be removed" })
        }
        await user.destroy({ where: { id } })
        res.status(200).json({ "Message": "User deleted" })
    }
    catch (error) {
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

// Password change
const updateOwnUserPassword = async (req, res) => {
    try {
        const id = req.user.id
        const getUser = await user.findOne({ where: { id } })
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ "Error": "You must fill the fields" })
        }
        
        const passCompare = await passwordCompare(oldPassword, getUser.user_password)
        if (!passCompare) {
            return res.status(400).json({ "Error": "Incorrect password" })
        }
        if (oldPassword == newPassword) {
            return res.status(400).json({ "Error": "New password cannot be the same as the old one" })
        }
        
        if (oldPassword.length > 30 || newPassword.length > 30) {
            return res.status(400).json({ "Error": "Password must be at most 30 characters" })
        }
        
        if (oldPassword.length < 4 || newPassword.length < 4) {
            return res.status(400).json({ "Error": "Password must be at least 4 characters" })
        }

        const passHash = await passwordHash(newPassword)

        await user.update({
            user_password: passHash,
        }, { where: { id } })
        res.status(200).json({ "Message": "Password has been changed" })



    }
    catch (error) {
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}


module.exports = {
    getUserById,
    updateOwnUser,
    deleteOwnUser,
    updateOwnUserPassword
}