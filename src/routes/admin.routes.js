const { Router } = require("express")
const { getUserByIdAdmin, getAllTransactionsAdmin, getAllUsersAdmin, deleteUserByIdAdmin, saveTransactionAdmin, updateUserByIdAdmin, deleteTransactionAdmin } = require("../controllers/admin.controller")
const { isAdmin } = require("../middleware/authorization");
const authentication = require("../middleware/authentication");
const router = Router()

// Users
router.get('/users/all', authentication, isAdmin, getAllUsersAdmin)
//router.get('/users/:id', authentication, isAdmin, getUserByIdAdmin)
router.put('/users/:id', authentication, isAdmin, updateUserByIdAdmin)
router.delete('/users/:id', authentication, isAdmin, deleteUserByIdAdmin)

// Transactions
router.get('/transactions/all', authentication, isAdmin, getAllTransactionsAdmin)
router.post('/transactions', authentication, isAdmin, saveTransactionAdmin)
router.delete('/transactions/:id', authentication, isAdmin, deleteTransactionAdmin)

//      --------------Other Admin routes-------------:
//  Sign up being admin :           router.post('/up', signUp, signUpAdmin)
//  Save Product:                   router.post('/', authentication, isAdmin, saveProductAdmin)
//  Update any transaction by id:    router.put('/:id', authentication, isUserTransactionOrAdmin, cancelTransactionById, updateTransactionAdmin)
//  Update any transaction by id:   router.put('/:id', authentication, isUserProductOrAdmin, updateProduct, updateProductAdmin)
//  Delete any transaction by id:   router.delete('/transactions/:id', authentication, isAdmin, deleteTransactionAdmin)
//  Delete any product by id:       router.delete('/product/:id', authentication, isAdmin, deleteProduct)

module.exports = router