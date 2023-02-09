const { Router } = require("express");
const { getUserById, updateOwnUser, deleteOwnUser } = require("../controllers/users.controller");
const authentication = require('../middleware/authentication');
const router = Router()

router.get('/:id', getUserById)
router.put('/', authentication, updateOwnUser)
router.delete('/', authentication, deleteOwnUser)

module.exports = router