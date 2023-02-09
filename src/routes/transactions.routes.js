const { Router } = require("express")
const { cancelTransactionById, getTransactionById, getOwnTransactions, saveTransaction } = require("../controllers/transactions.controller")
const { isUserTransactionOrAdmin } = require("../middleware/authorization")
const authentication = require("../middleware/authentication")
const { updateTransactionAdmin } = require("../controllers/admin.controller")
const router = Router()

router.get('/', authentication, getOwnTransactions)
router.get('/:id', authentication, isUserTransactionOrAdmin, getTransactionById)
router.post('/', authentication, saveTransaction)
router.put('/:id', authentication, isUserTransactionOrAdmin, cancelTransactionById, updateTransactionAdmin)

module.exports = router