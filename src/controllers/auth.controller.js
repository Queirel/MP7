const { passwordHash, passwordCompare } = require("../helpers/bcrypt")
const jwt = require("jsonwebtoken")
const { user } = require("../models")
require('dotenv').config()

// Login
const signIn = async (req, res) => {
    try {
        const bearerToken = req.headers['authorization']
        if (bearerToken) {
            return res.status(400).send('You are already logged')
        }
        const { user_name, user_password } = req.body
        const getuser = await user.findOne({ where: { user_name } })
        if (!getuser) {
            return res.status(400).send('Username or password incorrect')
        }
        const passCompare = await passwordCompare(user_password, getuser.user_password)
        if (!passCompare) {
            return res.status(400).send('User or password incorrect')
        }
        const payload = {
            id: getuser.id,
            user_role: getuser.user_role
        }
        jwt.sign(payload, process.env.AUTH_PASSWORD, { expiresIn: process.env.AUTH_EXPIRES }, (error, token) => {
            if (error) {
                return res.status(400).send(`Error while procesing token ${error}`)
            }
            res.status(200).json({ token })
        })
    }
    catch (error) {
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

// Register ---> Create User
const signUp = async (req, res) => {
    try {
        const bearerToken = req.headers['authorization']
        if (bearerToken) {
            const token = bearerToken.split(' ')[1]
            jwt.verify(token, process.env.AUTH_PASSWORD, (error, payload) => {
                if (error) {
                    return res.status(400).send('Some error while verifying token')
                }
                return res.status(400).send('You are already logged')
            })
        }
        const { user_name, user_dni, user_password, user_realname, user_birthdate, user_lastname } = req.body
        const getUser = await user.findOne({ where: { user_name } })
        if (getUser) {
            return res.status(400).json({ "Error": "The username alredy exists" })
        }
        if (/[^a-zA-Z]/.test(user_name)) {
            return res.status(400).json({ "Error": "The username must be only letters" })
        }
        if (user_name.length > 15) {
            return res.status(400).json({ "Error": "The username must be less than 15 characters" })
        }
        if (user_name.length < 3) {
            return res.status(400).json({ "Error": "The username must be at least 3 letters" })
        }
        if (/[^a-zA-Z]/.test(user_realname)) {
            return res.status(400).json({ "Error": "The name must be only letters" })
        }
        if (user_realname.length > 15) {
            return res.status(400).json({ "Error": "The name must be less than 15 characters" })
        }
        if (user_realname.length < 3) {
            return res.status(400).json({ "Error": "The name must be at least 3 letters" })
        }
        if (/[^a-zA-Z]/.test(user_lastname)) {
            return res.status(400).json({ "Error": "The lastname must be only letters" })
        }
        if (user_lastname.length > 15) {
            return res.status(400).json({ "Error": "The lastname must be less than 15 characters" })
        }
        if (user_lastname.length < 2) {
            return res.status(400).json({ "Error": "The lastname must be at least 2 letters" })
        }
        if (/[^0-9]/.test(user_dni)) {
            return res.status(400).json({ "Error": "DNI must be an integer" })
        }
        if (user_dni.length < 8) {
            return res.status(400).json({ "Error": "DNI must be at least 8 numbers" })
        }
        if (user_dni.length > 10) {
            return res.status(400).json({ "Error": "DNI must be at most 10 numbers" })
        }
        if (user_password.length > 30) {
            return res.status(400).json({ "Error": "Password must be at most 30 characters" })
        }
        if (user_password.length < 4) {
            return res.status(400).json({ "Error": "Password must be at least 4 characters" })
        }
        const passHash = await passwordHash(user_password)
        const newUser = await user.create({
            user_name,
            user_password: passHash,
            user_realname,
            user_birthdate,
            user_lastname,
            user_dni
        })
        res.status(200).json({
            "User name": newUser.user_name,
            "Name": newUser.user_realname,
            "Lastname": newUser.user_lastname,
            "DNI": newUser.user_dni,
            "Birthdate": newUser.user_birthdate
        })
    }
    catch (error) {
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

// Register ---> Create User By Admin (with roles)
const signUpAdmin = async (req, res) => {
    try {
        const { user_name, user_dni, user_password, user_realname, user_birthdate, user_lastname, user_role } = req.body
        const getUser = await user.findOne({ where: { user_name } })
        if (getUser) {
            return res.status(400).json({ "Error": "The username alredy exists" })
        }
        if (/[^a-zA-Z]/.test(user_name)) {
            return res.status(400).json({ "Error": "The username must be only letters" })
        }
        if (user_name.length > 15) {
            return res.status(400).json({ "Error": "The username must be less than 15 characters" })
        }
        if (user_name.length < 3) {
            return res.status(400).json({ "Error": "The username must be at least 3 letters" })
        }
        if (/[^a-zA-Z]/.test(user_realname)) {
            return res.status(400).json({ "Error": "The name must be only letters" })
        }
        if (user_realname.length > 15) {
            return res.status(400).json({ "Error": "The name must be less than 15 characters" })
        }
        if (user_realname.length < 3) {
            return res.status(400).json({ "Error": "The name must be at least 3 letters" })
        }
        if (/[^a-zA-Z]/.test(user_lastname)) {
            return res.status(400).json({ "Error": "The lastname must be only letters" })
        }
        if (user_lastname.length > 15) {
            return res.status(400).json({ "Error": "The lastname must be less than 15 characters" })
        }
        if (user_lastname.length < 2) {
            return res.status(400).json({ "Error": "The lastname must be at least 2 letters" })
        }
        if (/[^0-9]/.test(user_dni)) {
            return res.status(400).json({ "Error": "DNI must be an integer" })
        }
        if (user_dni.length < 8) {
            return res.status(400).json({ "Error": "DNI must be at least 8 numbers" })
        }
        if (user_dni.length > 10) {
            return res.status(400).json({ "Error": "DNI must be at most 10 numbers" })
        }
        if (user_password.length > 30) {
            return res.status(400).json({ "Error": "Password must be at most 30 characters" })
        }
        if (user_password.length < 4) {
            return res.status(400).json({ "Error": "Password must be at least 4 characters" })
        }
        const roles = ["user", "admin"]
        if (!roles.includes(user_role)) {
            return res.status(400).json({ "Error": "The role does not exist" })
        }
        const passHash = await passwordHash(user_password)
        const newUser = await user.create({
            user_name,
            user_password: passHash,
            user_realname,
            user_role,
            user_birthdate,
            user_lastname,
            user_dni
        })
        res.status(200).json({ "User": newUser })
    }
    catch (error) {
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

module.exports = {
    signIn,
    signUp,
    signUpAdmin
}