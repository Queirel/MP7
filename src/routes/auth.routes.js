const { Router } = require("express")
const { signIn, signUp } = require("../controllers/auth.controller")
const router = Router()

router.post('/in', signIn)
router.post('/up', signUp)

module.exports = router