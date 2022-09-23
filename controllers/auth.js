const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect');
      error.statusCode = 422;
      error.validationErrors = errors.array();
      throw error;
    }
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPassword,
      posts: [],
    });
    await user.save();
    res.status(201).json({
      message: 'User created succesfully',
      user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
