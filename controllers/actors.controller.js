const { Actor } = require('../models/actor.model');

const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

exports.getAllActors = catchAsync(async (req, res, next) => {
  const actors = await Actor.findAll({ where: { status: 'active' } });

  if (!actors) {
    return next(new AppError(404, 'Actors not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { actors }
  });
});
exports.getActorById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const actor = await Actor.findOne({ where: { id, status: 'active' } });

  if (!actor) {
    return next(new AppError(404, 'No actor found with the given ID'));
  }

  res.status(200).json({
    status: 'success',
    data: { actor }
  });
});
exports.createNewActor = catchAsync(async (req, res, next) => {
  const { name, country, age, profilePic, role } = req.body;

  if (!name || !country || !age || !profilePic || !role) {
    return next(new AppError(400, 'Must provide a valid data'));
  }

  const newActor = await Actor.create({
    name,
    country,
    age,
    profilePic,
    role
  });

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
