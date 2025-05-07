const Signupcontroller = require('../Controllers/SignupController');

const express = require('express')

const router = express.Router()

router.post('/signup',Signupcontroller.signups)

module.exports = router;