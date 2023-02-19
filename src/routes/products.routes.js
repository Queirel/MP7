const { Router } = require("express")
const { getProducts, saveProduct, getProductById, updateProduct, deleteProduct, getProdByCategory, getProductByUserId } = require("../controllers/products.controller")
const { isUserProduct } = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.get('/user/:id', getProductByUserId)
router.get('/category/:category', getProdByCategory)
router.post('/', authentication, saveProduct)
router.put('/:id', authentication, isUserProduct, updateProduct)
router.delete('/:id', authentication, isUserProduct, deleteProduct)

module.exports = router