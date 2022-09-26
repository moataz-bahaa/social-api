const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Email not found');
      error.statusCode = 401;
      throw error;
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      const error = new Error('Incorrect password');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ email: user.email, userId: user._id.toString() }, 'secret', {
      expiresIn: '1h',
    });
    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
