const express = require('express');
const router = express.Router();
const {handleNewUserSignup} = require('../controllers/user')

router.post('/', handleNewUserSignup)

module.exports = router;