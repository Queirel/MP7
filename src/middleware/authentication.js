const jwt = require("jsonwebtoken")
// const user = require('../models/users.models')

const middleware = (req, res, next) => {
    try {
        if (req.path != '/sign/in') {
            const bearerToken = req.headers['authorization']
            if (bearerToken) {
                token = bearerToken.split(' ')[1]
                jwt.verify(token, process.env.AUTH_PASSWORD, (error, payload) => {
                    if (error) {
                        res.status(403).send('Some error while verifying token', error)
                    }
                    else {
                        req.user = payload
                        next()
                    }
                })
            }
            else {
                res.status(403).send('U need a token first')
            }
        }
        else {
            next()
        }
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = middleware