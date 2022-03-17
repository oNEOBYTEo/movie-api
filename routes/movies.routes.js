const express = require('express');

const {
  getAllMovies,
  getMovieById,
  createNewMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movies.controller');

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', createNewMovie);
router.patch('/:id', updateMovie);
router.delete('/:id', deleteMovie);

module.exports = { moviesRouter: router };
