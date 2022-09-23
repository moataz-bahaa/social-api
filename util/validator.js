const { body } = require('express-validator');
const User = require('../models/user');

exports.postValidator = [
  body('title', 'title should be at least 3 charachters').trim().isLength({ min: 3 }),
  body('content', 'content should be at least 3 charachters').trim().isLength({ min: 5 }),
];

exports.userValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('E-mail address already exists');
      }
    })
    .normalizeEmail(),
  body('password', 'password must be at least 6 charcters length of alpha numeric values')
    .trim()
    .isLength({ min: 6 })
    .isAlphanumeric(),
  body('name').trim().notEmpty(),
];
