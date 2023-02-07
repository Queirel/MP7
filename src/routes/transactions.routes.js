const { Router } = require("express")
const { cancelTransaction, getTransaction, getOwnTransactions, saveTransaction } = require("../controllers/transactions.controller")
const { isUserTransaction } = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const router = Router()

router.get('/', authentication, getOwnTransactions)
router.get('/:id', authentication, isUserTransaction, getTransaction)
router.post('/', authentication, saveTransaction)
router.put('/:id', authentication, isUserTransaction, cancelTransaction)

module.exports = router