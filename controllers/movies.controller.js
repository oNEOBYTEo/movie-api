const { Movie } = require('../models/movie.model');

const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll({ where: { status: 'active' } });

  if (!movies) {
    return next(new AppError(404, 'Movies not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { movies }
  });
});
exports.getMovieById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findOne({ where: { id, status: 'active' } });

  if (!movie) {
    return next(new AppError(404, 'No movie found with the given ID'));
  }

  res.status(200).json({
    status: 'success',
    data: { movie }
  });
});
exports.createNewMovie = catchAsync(async (req, res, next) => {
  const { title, duration, description, imgUrl, genre } = req.body;

  if (!title || !duration || !description || !imgUrl || !genre) {
    return next(new AppError(400, 'Must provide a valid data'));
  }

  const newMovie = await Movie.create({
    title,
    duration,
    description,
    imgUrl,
    genre
  });

  res.status(201).json({
    status: 'success',
    data: { newMovie }
  });
});
exports.updateMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'title', 'duration', 'imgUrl', 'genre');

  const updatedMovie = await Movie.findOne({
    where: { id, status: 'active' }
  });

  if (!updatedMovie) {
    return next(new AppError(404, 'Cant update movie, invalid ID'));
  }

  await updatedMovie.update({ ...data });

  res.status(204).json({
    status: 'success'
  });
});
exports.deleteMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedMovie = await Movie.findOne({ where: { id, status: 'active' } });

  if (!deletedMovie) {
    return next(new AppError(404, 'Cant delete movie, invalid ID'));
  }

  await deletedMovie.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
