const jwt = require("jsonwebtoken")
const logger = require("../helpers/logger")

const authentication = (req, res, next) => {
    try {
        const bearerToken = req.headers['authorization']
        if (bearerToken) {
            const token = bearerToken.split(' ')[1]
            jwt.verify(token, process.env.AUTH_PASSWORD, (error, payload) => {
                if (error) {
                    return res.status(400).json({"Error":"Some error while verifying token"})
                }
                    else {
                        req.user = payload
                        // logger.info(`User ${req.user.id} (${req.user.user_role}) authenticated successfully`)
                        next()
                }
            })
        }
        else {
            return res.status(400).json({'Error':'You must be logged'})
        }
     }
    catch (error) {
        logger.error(`middl-authentication - Error (500): ${error.message}`)
        res.status(500).json({ "Error": "An unexpected error occurred. please try again later" })
    }
}

module.exports = authentication