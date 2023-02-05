const { Router } = require("express");
const { getUser, updateUser, deleteUser, getUsers } = require("../controllers/users.controller");
const { isUser, isAdmin } = require("../middleware/authorization");
const authentication = require('../middleware/authentication');
const router = Router()

router.get('/:id', getUser)
router.put('/:id', authentication, isUser, updateUser)
router.delete('/:id', authentication, isUser, deleteUser)
router.get('/', authentication, isAdmin, getUsers)

module.exports = router