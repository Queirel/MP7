const { passwordHash, passwordCompare } = require("../helpers/bcrypt")
const jwt = require("jsonwebtoken")
const { user } = require("../models")
require('dotenv').config()

// Login
const signIn = async (req, res) => {
    try {
    const bearerToken = req.headers['authorization']
    if (!bearerToken) {
        const { user_name, user_password } = req.body
        const getuser = await user.findOne({ where: { user_name } })
        if (getuser) {
            const passCompare = await passwordCompare(user_password, getuser.user_password)
            if (passCompare) {
                const payload = {
                    id: getuser.id,
                    user_role: getuser.user_role
                }
                jwt.sign(payload, process.env.AUTH_PASSWORD, { expiresIn: process.env.AUTH_EXPIRES }, (error, token) => {
                    if (error) {
                        res.status(404).send(`Error while procesing token ${error}`)
                    }
                    else {
                        res.status(200).json({ token })
                    }
                })
            }
            else {
                res.status(404).send('User or password incorrect')
            }
        }
        else {
            res.status(404).send('Username or password incorrect')
        }
    }
    else {
        res.status(403).send('You are already logged')
    }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Register ---> Create User
const signUp = async (req, res) => {
    try {
        const bearerToken = req.headers['authorization']
        if (!bearerToken) {
            const { user_name, user_dni, user_password, user_realname, user_birthdate, user_lastname } = req.body
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
        else {
            const token = bearerToken.split(' ')[1]
            jwt.verify(token, process.env.AUTH_PASSWORD, (error, payload) => {
                if (error) {
                    res.status(403).send('Some error while verifying token')
                }
                else {
                    res.status(401).send('You are already logged')
                }
            })
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Register ---> Create User By Admin (with roles)
const signUpAdmin = async (req, res) => {
    try {
        const { user_name, user_dni, user_password, user_realname, user_birthdate, user_lastname, user_role } = req.body
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
        res.status(200).json(newUser)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = {
    signIn,
    signUp,
    signUpAdmin
}