const express = require('express');

const feedController = require('../controllers/feed');
const { postValidator } = require('../util/validator');
const upload = require('../util/upload');

const router = express.Router();

// /feed
router.get('/posts', feedController.getPosts);

router.post('/post', upload.single('image'), postValidator, feedController.createPost);

router.get('/post/:id', feedController.getPostById);

router.put('/post/:id', upload.single('image'), postValidator, feedController.putUpdatePost);

router.delete('/post/:id', feedController.deletePost);

module.exports = router;