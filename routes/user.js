const express = require('express')
const router = express.Router()
const user = require('../controller/user')
const { checkToken } = require('../controller/auth')

router.get('/',checkToken, user.getAllUser)
router.get('/:id',checkToken, user.getUser)
router.post('/',user.addUser)
router.put('/:id',checkToken, user.editUser)
router.patch('/:id',checkToken, user.editUser)
router.delete('/:id',checkToken, user.deleteUser)

module.exports = router