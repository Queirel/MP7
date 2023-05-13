require('dotenv').config()
const { passwordHash, passwordCompare } = require("../helpers/bcrypt")
const jwt = require("jsonwebtoken")
const logger = require("../helpers/logger");
const { user } = require("../models");
const { geocode } = require("../helpers/geocode");
const { createCustomer } = require("../helpers/stripe");

// Login
const signIn = async (req, res) => {
    try {
        const bearerToken = req.headers['authorization']
        if (bearerToken) {
            return res.status(400).json({ "Error": "You are already logged" })
        }
        const { user_name, user_password } = req.body
        if (!user_name) {
            return res.status(400).json({ "Error": "The username field must be completed" })
        }
        if (!user_password) {
            return res.status(400).json({ "Error": "The password field must be completed" })
        }
        const getuser = await user.findOne({ where: { user_name } })
        if (!getuser) {
            return res.status(400).json({ "Error": "Username or password incorrect" })
        }
        const passCompare = await passwordCompare(user_password, getuser.user_password)
        if (!passCompare) {
            return res.status(400).json({ "Error": 'User or password incorrect' })
        }
        const payload = {
            id: getuser.id,
            user_role: getuser.user_role
        }
        jwt.sign(payload, process.env.AUTH_PASSWORD, { expiresIn: process.env.AUTH_EXPIRES }, (error, token) => {
            if (error) {
                return res.status(400).json(`Error while procesing token ${error}`)
            }
            logger.info(`/sign/in - User ${getuser.id} logged in`)
            return res.status(200).json({ token })
        })
    }
    catch (error) {
        logger.error(`/sign/in - Error (500): ${error.message}`)
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
                    return res.status(400).json({ "Error": "Some error while verifying token" })
                }
            })
            return res.status(400).json({ "Error": "You are already logged" })
        }
        const { user_name, user_dni, user_password, user_realname, user_email, user_lastname, user_street_number, user_route, user_locality } = req.body
        if (!user_name) {
            return res.status(400).json({ "Error": "The username field must be completed" })
        }
        const getUser = await user.findOne({ where: { user_name } })
        if (getUser) {
            return res.status(400).json({ "Error": "The username alredy exists" })
        }
        if (/[^a-zA-Z0-9]/.test(user_name)) {
            return res.status(400).json({ "Error": "The username must be only letters and numbers" })
        }
        if (user_name.length >= 15) {
            return res.status(400).json({ "Error": "The username must be less than 15 characters" })
        }
        if (user_name.length < 3) {
            return res.status(400).json({ "Error": "The username must be at least 3 characters" })
        }

        if (!user_realname) {
            return res.status(400).json({ "Error": "The name field must be completed" })
        }
        if (/[^a-zA-Z]/.test(user_realname)) {
            return res.status(400).json({ "Error": "The name must be only letters" })
        }
        if (user_realname.length >= 15) {
            return res.status(400).json({ "Error": "The name must be less than 15 characters" })
        }
        if (user_realname.length < 3) {
            return res.status(400).json({ "Error": "The name must be at least 3 letters" })
        }

        if (!user_lastname) {
            return res.status(400).json({ "Error": "The lastname field must be completed" })
        }
        if (/[^a-zA-Z]/.test(user_lastname)) {
            return res.status(400).json({ "Error": "The lastname must be only letters" })
        }
        if (user_lastname.length >= 15) {
            return res.status(400).json({ "Error": "The lastname must be less than 15 characters" })
        }
        if (user_lastname.length < 2) {
            return res.status(400).json({ "Error": "The lastname must be at least 2 letters" })
        }

        if (!user_dni) {
            return res.status(400).json({ "Error": "The DNI field must be completed" })
        }
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

        if (!user_password) {
            return res.status(400).json({ "Error": "The password field must be completed" })
        }
        if (user_password.length > 30) {
            return res.status(400).json({ "Error": "Password must be at most 30 characters" })
        }
        if (user_password.length < 4) {
            return res.status(400).json({ "Error": "Password must be at least 4 characters" })
        }

        if (!user_email) {
            return res.status(400).json({ "Error": "The email field must be completed" })
        }

        if (user_street_number.length > 30) {
            return res.status(400).json({ "Error": "The street number must be at most 10 characters" })
        }
        if (user_route.length > 30) {
            return res.status(400).json({ "Error": "Route must be at most 30 characters" })
        }
        if (user_locality.length > 30) {
            return res.status(400).json({ "Error": "Locality must be at most 30 characters" })
        }
        const user_address = `${user_street_number},${user_route},${user_locality}`;
        const address = await geocode(user_address);
        if(address == "Error"){
            return res.status(400).json({ "Error": "Some address field is incorrect" })
        }

        const passHash = await passwordHash(user_password)
        const customerId = await createCustomer(user_name, user_email)
        const newUser = await user.create({
            user_name,
            user_password: passHash,
            user_realname,
            user_email,
            user_lastname,
            user_dni,
            user_customer_id: customerId.id,
            user_address: address.Place
        })
        logger.info(`/sign/up - User ${newUser.dataValues.id} created successfully`)
        res.status(200).send({
            id: newUser.user_id,
            "User name": newUser.user_name,
            "Name": newUser.user_realname,
            "Lastname": newUser.user_lastname,
            "DNI": newUser.user_dni,
            "email": newUser.user_email,
            "Address": address,
            "Customer Id": newUser.user_customer_id
        })
    }
    catch (error) {
        logger.error(`/sign/up - Error (500): ${error.message}`)
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
        console.log(error.message)
    }
}

// Register ---> Create User By Admin (with roles)
const signUpAdmin = async (req, res) => {
    try {
        const { user_name, user_dni, user_password, user_realname, user_email, user_lastname, user_role, user_street_number, user_route, user_locality } = req.body
        if (!user_name) {
            return res.status(400).json({ "Error": "The username field must be completed" })
        }
        const getUser = await user.findOne({ where: { user_name } })
        if (getUser) {
            return res.status(400).json({ "Error": "The username alredy exists" })
        }
        if (/[^a-zA-Z0-9]/.test(user_name)) {
            return res.status(400).json({ "Error": "The username must be only letters and numbers" })
        }
        if (user_name.length >= 15) {
            return res.status(400).json({ "Error": "The username must be less than 15 characters" })
        }
        if (user_name.length < 3) {
            return res.status(400).json({ "Error": "The username must be at least 3 characters" })
        }

        if (!user_realname) {
            return res.status(400).json({ "Error": "The name field must be completed" })
        }
        if (/[^a-zA-Z]/.test(user_realname)) {
            return res.status(400).json({ "Error": "The name must be only letters" })
        }
        if (user_realname.length >= 15) {
            return res.status(400).json({ "Error": "The name must be less than 15 characters" })
        }
        if (user_realname.length < 3) {
            return res.status(400).json({ "Error": "The name must be at least 3 letters" })
        }

        if (!user_lastname) {
            return res.status(400).json({ "Error": "The lastname field must be completed" })
        }
        if (/[^a-zA-Z]/.test(user_lastname)) {
            return res.status(400).json({ "Error": "The lastname must be only letters" })
        }
        if (user_lastname.length >= 15) {
            return res.status(400).json({ "Error": "The lastname must be less than 15 characters" })
        }
        if (user_lastname.length < 2) {
            return res.status(400).json({ "Error": "The lastname must be at least 2 letters" })
        }

        if (!user_dni) {
            return res.status(400).json({ "Error": "The DNI field must be completed" })
        }
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

        if (!user_password) {
            return res.status(400).json({ "Error": "The password field must be completed" })
        }
        if (user_password.length > 30) {
            return res.status(400).json({ "Error": "Password must be at most 30 characters" })
        }
        if (user_password.length < 4) {
            return res.status(400).json({ "Error": "Password must be at least 4 characters" })
        }

        if (!user_email) {
            return res.status(400).json({ "Error": "The email field must be completed" })
        }

        if (!user_role) {
            return res.status(400).json({ "Error": "The role field must be completed" })
        }
        const roles = ["user", "admin"]
        if (!roles.includes(user_role)) {
            return res.status(400).json({ "Error": "The role does not exist" })
        }

        
        if (user_street_number.length > 30) {
            return res.status(400).json({ "Error": "The street number must be at most 10 characters" })
        }
        if (user_route.length > 30) {
            return res.status(400).json({ "Error": "Route must be at most 30 characters" })
        }
        if (user_locality.length > 30) {
            return res.status(400).json({ "Error": "Locality must be at most 30 characters" })
        }
        const user_address = `${user_street_number},${user_route},${user_locality}`;
        const address = await geocode(user_address);
        if(address == "Error"){
            return res.status(400).json({ "Error": "Some address field is incorrect" })
        }

        const passHash = await passwordHash(user_password)
        const customerId = await createCustomer(user_name, user_email)
        const newUser = await user.create({
                user_name,
            user_password: passHash,
            user_realname,
            user_role,
            user_email,
            user_lastname,
            user_dni,
            user_address: address.Place,
            user_customer_id: customerId.id,
        })
        logger.info(`/admin/sign/up - User ${newUser.dataValues.id} created successfully by user ${req.user.id}`)
        res.status(200).json( newUser.dataValues )
    }
    catch (error) {
        logger.error(`/admin/sign/up - Error (500): ${error.message}`)
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" }).json({error})
        console.log(error.message)
    }
}

module.exports = {
    signIn,
    signUp,
    signUpAdmin
}