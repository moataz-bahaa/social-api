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
    authorId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', schema);
