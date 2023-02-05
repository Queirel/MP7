const { Router } = require("express")
const { cancelTransaction, getTransaction, getTransactions, saveTransaction, deleteTransaction } = require("../controllers/transactions.controller")
const { isUserTransaction, isSuperadmin } = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const router = Router()

router.get('/', authentication, isUserTransaction || isSuperadmin, getTransactions)
router.post('/', authentication, saveTransaction)
router.get('/:id', authentication, isUserTransaction, getTransaction)
router.put('/:id', authentication, isUserTransaction, cancelTransaction)
router.delete('/:id', authentication, isUserTransaction, deleteTransaction)

module.exports = router