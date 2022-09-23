const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    imageUrl: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', schema);
