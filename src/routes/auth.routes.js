const { Router } = require("express")
const { singIn, singUp } = require("../controllers/auth.controller")
const { isLogged } = require("../middleware/authorization")
const router = Router()

router.post('/in', isLogged, singIn)
router.post('/up', isLogged, singUp)

module.exports = router