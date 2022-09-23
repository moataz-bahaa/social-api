const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  status: {
    type: String,
    default: 'I am new!',
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = mongoose.model('User', schema);
