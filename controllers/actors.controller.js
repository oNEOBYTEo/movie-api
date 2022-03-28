const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { validationResult } = require('express-validator');

// Models
const { Actor } = require('../models/actor.model');
const { Movie } = require('../models/movie.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');
const { storage } = require('../util/firebase');

exports.getAllActors = catchAsync(async (req, res, next) => {
  const actors = await Actor.findAll({
    where: { status: 'active' },
    include: { model: Movie }
  });

  if (!actors) {
    return next(new AppError(404, 'Actors not found'));
  }

  const actorsPromises = actors.map(async (actor) => {
    let imgRef = ref(storage, actor.profilePic);

    let imgDownloadUrl = await getDownloadURL(imgRef);

    actor.profilePic = imgDownloadUrl;

    const moviesPromises = actor.movies.map(async (movie) => {
      imgRef = ref(storage, movie.imgUrl);
      imgDownloadUrl = await getDownloadURL(imgRef);
      movie.imgUrl = imgDownloadUrl;
    });

    const resolvedActorsPics = await Promise.all(moviesPromises);
    actor.movies = resolvedActorsPics;

    return actor;
  });

  const resolvedActors = await Promise.all(actorsPromises);

  res.status(200).json({
    status: 'success',
    data: { actors: resolvedActors }
  });
});
exports.getActorById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const actor = await Actor.findOne({
    where: { id, status: 'active' },
    include: { model: Movie }
  });

  if (!actor) {
    return next(new AppError(404, 'No actor found with the given ID'));
  }

  let imgRef = ref(storage, actor.profilePic);

  let imgDownloadUrl = await getDownloadURL(imgRef);

  actor.profilePic = imgDownloadUrl;

  const moviesPromises = actor.movies.map(async (movie) => {
    imgRef = ref(storage, movie.imgUrl);
    imgDownloadUrl = await getDownloadURL(imgRef);
    movie.imgUrl = imgDownloadUrl;
  });

  const resolvedActorsPics = await Promise.all(moviesPromises);
  actor.movies = resolvedActorsPics;

  res.status(200).json({
    status: 'success',
    data: { actor }
  });
});
exports.createNewActor = catchAsync(async (req, res, next) => {
  const { name, country, age, role } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');

    return next(new AppError(400, errorMsg));
  }

  const imgUploaded = ref(
    storage,
    `imgs/${Date.now()}-${req.file.originalname}`
  );

  const result = await uploadBytes(imgUploaded, req.file.buffer);

  const newActor = await Actor.create({
    name,
    country,
    age,
    profilePic: result.metadata.fullPath,
    role
  });

  const imgRef = ref(storage, newActor.profilePic);
  const imgDownloadUrl = await getDownloadURL(imgRef);
  newActor.profilePic = imgDownloadUrl;

  res.status(201).json({
    status: 'success',
    data: { newActor }
  });
});
exports.updateActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = filterObj(req.body, 'name', 'country', 'age', 'profilePic');

  const updatedActor = await Actor.findOne({ where: { id, status: 'active' } });

  if (!updatedActor) {
    return next(new AppError(404, 'Cant update actor, invalid ID'));
  }

  await updatedActor.update({ ...data });

  res.status(204).json({
    status: 'success'
  });
});
exports.deleteActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedActor = await Actor.findOne({ where: { id, status: 'active' } });

  if (!deletedActor) {
    return next(new AppError(404, 'Cant delete actor, invalid ID'));
  }

  await deletedActor.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});
