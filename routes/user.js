const express = require('express');
const router = express.Router();
const {handleNewUserSignup} = require('../controllers/user')
const {handleUserSignin} = require('../controllers/user')

router.post('/signup', handleNewUserSignup)
router.post('/signin', handleUserSignin)

module.exports = router;