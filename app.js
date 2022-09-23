require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const feedRoutes = require('./routes/feed');
const corsMiddleware = require('./middlewars/cors');
const rootDir = require('./util/path');

const MONGODP_URI = process.env.MONGODB_URI;

const app = express();

app.use('/images', express.static(path.join(rootDir, 'images')));
app.use(express.json());

// CORS
app.use(corsMiddleware);

// routes
app.use('/feed', feedRoutes);

// error handling
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500,
    message = error.message || 'Error on server';
  res.status(statusCode).json({
    message,
    validationErrors: error.errors || [],
  });
});

const port = process.env.PORT || 8080;

(async () => {
  try {
    const result = await mongoose.connect(MONGODP_URI);
    app.listen(port, () => {
      console.log(`Server is Listening on port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();

// 25 - 15
