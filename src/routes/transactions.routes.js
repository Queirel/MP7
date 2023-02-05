const { Router } = require("express")
const { cancelTransaction, getTransaction, getAllTransactions, getTransactions, saveTransaction, deleteTransaction } = require("../controllers/transactions.controller")
const { isUserTransaction, isAdmin } = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const router = Router()

router.get('/', authentication, getTransactions)
router.get('/all', authentication, isAdmin, getAllTransactions)
router.post('/', authentication, saveTransaction)
router.get('/:id', authentication, isUserTransaction, getTransaction)
router.put('/:id', authentication, isUserTransaction, cancelTransaction)
router.delete('/:id', authentication, isUserTransaction, deleteTransaction)

module.exports = router