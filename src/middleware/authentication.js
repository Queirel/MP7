const jwt = require("jsonwebtoken")

const authentication = (req, res, next) => {
    try {
        const bearerToken = req.headers['authorization']
        if (bearerToken) {
            const token = bearerToken.split(' ')[1]
            jwt.verify(token, process.env.AUTH_PASSWORD, (error, payload) => {
                if (error) {
                    res.status(403).send('Some error while verifying token')
                }
                    else {
                        req.user = payload
                        next()
                }
            })
        }
        else {
            res.status(403).send('You must be logged')
        }
     }
    catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = authentication