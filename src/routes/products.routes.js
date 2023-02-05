const { Router } = require("express")
const { getProducts, saveProduct, getProduct, updateProduct, deleteProduct, getProdByCategory, getProductByUserId } = require("../controllers/products.controller")
const { isUserProduct } = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const router = Router()

router.get('/', getProducts)
router.post('/', authentication, isUserProduct, saveProduct)
router.get('/:id', getProduct)
router.put('/:id', authentication, isUserProduct, updateProduct)
router.delete('/:id', authentication, isUserProduct, deleteProduct)
router.get('/user/:id', getProductByUserId)
router.get('/category/:category', getProdByCategory)

module.exports = router