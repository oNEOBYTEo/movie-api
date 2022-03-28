const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { validationResult } = require('express-validator');

// Models
const { Movie } = require('../models/movie.model');
const { ActorInMovie } = require('../models/actorInMovie.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');
const { storage } = require('../util/firebase');
const { Actor } = require('../models/actor.model');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.findAll({
    where: { status: 'active' },
    include: [{ model: Actor }]
  });

  if (!movies) {
    return next(new AppError(404, 'Movies not found'));
  }

  const moviesPromises = movies.map(async (movie) => {
    let imgRef = ref(storage, movie.imgUrl);

    let imgDownloadUrl = await getDownloadURL(imgRef);

    movie.imgUrl = imgDownloadUrl;

    const actorsPromises = movie.actors.map(async (actor) => {
      imgRef = ref(storage, actor.profilePic);
      imgDownloadUrl = await getDownloadURL(imgRef);
      actor.profilePic = imgDownloadUrl;
    });

    const resolvedActorsPics = await Promise.all(actorsPromises);
    movie.actors = resolvedActorsPics;
    return movie;
  });

  const resolvedMovies = await Promise.all(moviesPromises);

  res.status(200).json({
    status: 'success',
    data: { movies: resolvedMovies }
  });
});
exports.getMovieById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findOne({
    where: { id, status: 'active' },
    include: { model: Actor }
  });

  if (!movie) {
    return next(new AppError(404, 'No movie found with the given ID'));
  }

  let imgRef = ref(storage, movie.imgUrl);
  let imgDownloadUrl = await getDownloadURL(imgRef);

  movie.imgUrl = imgDownloadUrl;

  const actorsPromises = movie.actors.map(async (actor) => {
    imgRef = ref(storage, actor.profilePic);
    imgDownloadUrl = await getDownloadURL(imgRef);
    actor.profilePic = imgDownloadUrl;
  });

  const resolvedActorsPics = await Promise.all(actorsPromises);
  movie.actors = resolvedActorsPics;

  res.status(200).json({
    status: 'success',
    data: { movie }
  });
});
exports.createNewMovie = catchAsync(async (req, res, next) => {
  const { title, description, duration, rating, genre, actors } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');
    return next(new AppError(400, errorMsg));
  }

  // Upload img to firebase
  const fileExtension = req.file.originalname.split('.')[1];

  const imgUploaded = ref(
    storage,
    `imgs/movies/${title}-${Date.now()}.${fileExtension}`
  );

  const result = await uploadBytes(imgUploaded, req.file.buffer);

  const newMovie = await Movie.create({
    title,
    description,
    duration,
    imgUrl: result.metadata.fullPath,
    rating,
    genre
  });

  const actorsInMoviesPromises = actors.map(async (actorId) => {
    // Assign actors to newly created movie
    return await ActorInMovie.create({ actorId, movieId: newMovie.id });
  });

  await Promise.all(actorsInMoviesPromises);

  const imgRef = ref(storage, newMovie.imgUrl);
  const imgDownloadUrl = await getDownloadURL(imgRef);

  newMovie.imgUrl = imgDownloadUrl;

  res.status(200).json({
    status: 'success',
    data: { newMovie }
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(
    req.body,
    'title',
    'description',
    'duration',
    'rating',
    'genre'
  );

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
