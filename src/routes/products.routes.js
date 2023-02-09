const { Router } = require("express")
const { getProducts, saveProduct, getProduct, updateProduct, deleteProduct, getProdByCategory, getProductByUserId } = require("../controllers/products.controller")
const { isUserProductOrAdmin} = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const router = Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.get('/user/:id', getProductByUserId)
router.get('/category/:category', getProdByCategory)
router.post('/', authentication, saveProduct)
router.put('/:id', authentication, isUserProductOrAdmin, updateProduct)
router.delete('/:id', authentication, isUserProductOrAdmin, deleteProduct)

module.exports = router