const { Router } = require("express");
const { getUserById, updateOwnUser, deleteOwnUser, updateOwnUserPassword } = require("../controllers/users.controller");
const authentication = require('../middleware/authentication');
const router = Router()

router.get('/:id', getUserById)
router.put('/', authentication, updateOwnUser)
router.put('/pass/new', authentication, updateOwnUserPassword)
router.delete('/', authentication, deleteOwnUser)

module.exports = router