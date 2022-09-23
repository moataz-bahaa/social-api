const fs = require('fs');
const path = require('path');

const rootDir = require('./path');

exports.clearImage = (url) => {
  const imageName = url.replace('http://localhost:8080/images/', '');
  const imagePath = path.join(rootDir, 'images', imageName);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
