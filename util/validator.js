const { body } = require('express-validator');

exports.postValidator = [
  body('title').trim().isLength({ min: 3 }),
  body('content').trim().isLength({ min: 5 }),
];
