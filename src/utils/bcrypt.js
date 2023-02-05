const bcryptjs = require('bcryptjs')
require('dotenv').config()

// Hash password
const passwordHash = (password) => {
    return bcryptjs.hash(password, Number.parseInt(process.env.AUTH_ROUNDS))
}

// Compare password
const passwordCompare = (password, passHash) => {
    return bcryptjs.compare(password, passHash)
}

module.exports = {
    passwordHash,
    passwordCompare
}