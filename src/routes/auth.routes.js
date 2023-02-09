const { Router } = require("express")
const { signIn, signUp, signUpAdmin } = require("../controllers/auth.controller")
const router = Router()

router.post('/in', signIn)
router.post('/up', signUp, signUpAdmin)

module.exports = router