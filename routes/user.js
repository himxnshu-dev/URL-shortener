const express = require('express');
const router = express.Router();
const {handleNewUserSignup} = require('../controllers/user')

router.post('/signup', handleNewUserSignup)

module.exports = router;