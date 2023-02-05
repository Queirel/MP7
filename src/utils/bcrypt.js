const bcryptjs = require('bcryptjs')
require('dotenv').config()


const passwordHash = (password) => {
    return bcryptjs.hash(password, Number.parseInt(process.env.AUTH_ROUNDS))
}

const passwordCompare = (password, passHash) => {
    return bcryptjs.compare(password, passHash)
}

module.exports = {
    passwordHash,
    passwordCompare
}