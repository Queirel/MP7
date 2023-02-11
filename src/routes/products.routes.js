const { Router } = require("express")
const { getProducts, saveProductOrAdmin, getProduct, updateProductOrAdmin, deleteProduct, getProdByCategory, getProductByUserId } = require("../controllers/products.controller")
const { isUserProductOrAdmin} = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const { updateProductAdmin, saveProductAdmin } = require("../controllers/admin.controller")
const router = Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.get('/user/:id', getProductByUserId)
router.get('/category/:category', getProdByCategory)
router.post('/', authentication, saveProductOrAdmin, saveProductAdmin)
router.put('/:id', authentication, updateProductOrAdmin, updateProductAdmin)
router.delete('/:id', authentication, isUserProductOrAdmin, deleteProduct)

module.exports = router