const jwt = require("jsonwebtoken")
// const user = require('../models/users.models')

const authentication = (req, res, next) => {
    try {
        const bearerToken = req.headers['authorization']
        if (bearerToken) {
            token = bearerToken.split(' ')[1]
            jwt.verify(token, process.env.AUTH_PASSWORD, (error, payload) => {
                if (error) {
                    res.status(403).send('Some error while verifying token')
                }
                // else {
                //     if (payload.user_role == 'admin') {
                //         req.admin = true
                //         next()
                //     }
                    else {
                        req.user = payload
                        next()
                    // }
                }
            })
        }
        else {
            res.status(403).send('U need a token first')
        }
     }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = authentication