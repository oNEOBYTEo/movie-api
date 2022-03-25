const express = require('express');

const {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movies.controller');

const { upload } = require('../util/multer');

const router = express.Router();

router
  .route('/')
  .get(getAllMovies)
  .post(upload.single('postImg'), createNewMovie);

router.route('/:id').get(getMovieById).patch(updateMovie).delete(deleteMovie);

module.exports = { moviesRouter: router };
