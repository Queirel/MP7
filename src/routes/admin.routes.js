const { Router } = require("express")
const { getUserByIdAdmin, getAllTransactionsAdmin, getAllUsersAdmin, deleteUserByIdAdmin, saveTransactionAdminStockControl, updateUserByIdAdmin, deleteTransactionAdmin, updateTransactionAdmin, updateProductAdmin, saveProductAdmin } = require("../controllers/admin.controller")
const { isAdmin } = require("../middleware/authorization");
const authentication = require("../middleware/authentication");
const { getTransactionById } = require("../controllers/transactions.controller");
const { deleteProduct } = require("../controllers/products.controller");
const { signUpAdmin } = require("../controllers/auth.controller");
const router = Router()

// Users
router.get('/users', authentication, isAdmin, getAllUsersAdmin)
router.get('/users/:id', authentication, isAdmin, getUserByIdAdmin)
router.put('/users/:id', authentication, isAdmin, updateUserByIdAdmin)
router.delete('/users/:id', authentication, isAdmin, deleteUserByIdAdmin)

// Transactions
router.get('/transactions', authentication, isAdmin, getAllTransactionsAdmin)
router.get('/transactions/:id', authentication, isAdmin, getTransactionById)
router.post('/transactions', authentication, isAdmin, saveTransactionAdminStockControl)
router.put('/transactions/:id', authentication, isAdmin, updateTransactionAdmin)
router.delete('/transactions/:id', authentication, isAdmin, deleteTransactionAdmin)

// Products
router.post('/products', authentication, isAdmin, saveProductAdmin)
router.put('/products/:id', authentication, isAdmin, updateProductAdmin)
router.delete('/products/:id', authentication, isAdmin, deleteProduct)

// Register
router.post('/sign/up', authentication, isAdmin, signUpAdmin)

module.exports = router