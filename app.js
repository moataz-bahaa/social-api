require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const corsMiddleware = require('./middlewars/cors');
const rootDir = require('./util/path');
const isAuth = require('./middlewars/is-auth');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const socket = require('./socket');

const MONGODP_URI = process.env.MONGODB_URI;

const app = express();

app.use('/images', express.static(path.join(rootDir, 'images')));
app.use(express.json());

// CORS
app.use(corsMiddleware);

// routes
app.use('/feed', isAuth, feedRoutes);
app.use('/auth', authRoutes);

// error handling
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const data = {
    message: error.message || 'Error on server',
  };
  if (error.validationErrors) {
    data.validationErrors = error.validationErrors;
  }
  res.status(statusCode).json(data);
});

const port = process.env.PORT || 8080;

(async () => {
  try {
    const dbConnection = await mongoose.connect(MONGODP_URI);
    const server = app.listen(port, () => {
      console.log(`Server is Listening on port: ${port}`);
    });
    const io = socket.init(server);
    io.on('connection', (socket) => {
      console.log('Client connected');
    });
  } catch (err) {
    console.log(err);
  }
})();

