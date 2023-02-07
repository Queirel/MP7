const { Router } = require("express")
const { getUserByIdAdmin, getAllTransactions, deleteTransaction, getAllUsers, deleteUserById } = require("../controllers/admin.controller")
const { deleteProduct } = require("../controllers/products.controller");
const router = Router()
// const { isAdmin } = require("../middleware/authorization");
// const authentication = require("../middleware/authentication");

router.get('/users/all', getAllUsers)
router.get('/transactions/all', getAllTransactions)
router.get('/users/:id', getUserByIdAdmin)
// router.post('/', saveProductAdmin) asdasdsad
// router.put('/users/:id', updateUserByIdAdmin)
// router.put('/:id', updateProductAdmin) asdasdasd
router.delete('/users/:id', deleteUserById)
router.delete('/transaction/:id', deleteTransaction)
router.delete('/:id', deleteProduct)

module.exports = router