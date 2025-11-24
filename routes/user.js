const express = require('express');
const {handleUserSignup} = require('../controllers/user');
const route = express.Router();

router.post('/',handleUserSignup)

module.exports = route;