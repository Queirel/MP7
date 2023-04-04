const { Router } = require("express")
const striper = require("../helpers/stripe")
const router = Router()

router.get('/', striper)
// router.get('/:id', getProductById)
// router.get('/user/:id', getProductByUserId)

module.exports = router