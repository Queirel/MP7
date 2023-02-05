const { passwordHash, passwordCompare } = require("../utils/bcrypt")
const jwt = require("jsonwebtoken")
const {user} = require("../models")

// Login
const singIn = async (req, res) => {
    try {
        const { user_name, user_password } = req.body
        const getuser = await user.findOne({ where: { user_name } })
        const passCompare = await passwordCompare(user_password, getuser.user_password)
        if (passCompare) {
            const payload = {
                id: getuser.id,
                user_role:getuser.user_role
            }
            jwt.sign(payload, process.env.AUTH_PASSWORD, {expiresIn: process.env.AUTH_EXPIRES}, (error, token) => {
                if (error) {
                    res.status(404).send(`Error while procesing token ${error}`)
                }
                else {
                    res.status(200).json({ token })
                }
            })
        }
        else {
            res.status(404).send('User id or password incorrect')
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

// Register ---> Create User
const singUp = async (req, res) => {
    try {
        const { user_name, user_password, user_role } = req.body
        const passHash = await passwordHash(user_password)
        const newUser = await user.create({
            user_role,
            user_name,
            user_password: passHash,
        })
        res.status(200).json(newUser)
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = {
    singIn,
    singUp
}