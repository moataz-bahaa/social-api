const { validationResult } = require('express-validator');

const Post = require('../models/post');
const { clearImage } = require('../util/image');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      posts,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect');
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }
    if (!req.file) {
      const error = new Error('No image provided');
      error.statusCode = 422;
      throw error;
    }
    const { title, content } = req.body;
    const filePath = req.file.path.replace('\\', '/'); // for windows
    const imageUrl = `http://${req.hostname}:8080/${filePath}`;
    const post = new Post({
      title,
      content,
      imageUrl,
    });
    const rseult = await post.save();
    res.status(201).json({
      message: 'Post created succefully',
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUpdatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect');
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }
    const { id } = req.params;
    let { title, content, image: imageUrl } = req.body;
    if (req.file) {
      const filePath = req.file.path.replace('\\', '/');
      imageUrl = `http://${req.hostname}:8080/${filePath}`;
    }
    if (!imageUrl) {
      const error = new Error('No image provided');
      error.statusCode = 422;
      throw error;
    }
    // updating on database
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error('Post is not exist');
      error.statusCode = 404;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    await post.save();
    res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};