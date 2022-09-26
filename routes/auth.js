const express = require('express');

const authController = require('../controllers/auth');
const { userValidator } = require('../util/validator');

const router = express.Router();

// /auth
router.put('/signup', userValidator, authController.signup);

router.post('/login', authController.login);

module.exports = router;
