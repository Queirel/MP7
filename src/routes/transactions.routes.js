const { Router } = require("express")
const { cancelTransactionById, getTransactionById, getOwnTransactions, createTransactionAndStockControl } = require("../controllers/transactions.controller")
const { isUserTransaction } = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const router = Router()

router.get('/', authentication, getOwnTransactions)
router.get('/:id', authentication, isUserTransaction, getTransactionById)
router.post('/', authentication, createTransactionAndStockControl)
router.put('/:id', authentication, isUserTransaction, cancelTransactionById)

module.exports = router