const multer = require('multer');

const { AppError } = require('./appError');

const storage = multer.memoryStorage();

const mulertFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    cb(new AppError(400, 'Must Provide an image as a file'), false);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter: mulertFileFilter
});

module.exports = { upload };
