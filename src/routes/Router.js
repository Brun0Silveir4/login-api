const express = require('express')
const router = express.Router()
const roles = require('../api/roles/index')


router.post('/roles', roles.create)


module.exports = router