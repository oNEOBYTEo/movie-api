const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');

const { User } = require('../models/user.model');

const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

dotenv.config({ path: './config.env' });

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    attributes: { exclude: 'password' }
  });

  if (!users) {
    return next(new AppError(404, 'Not found users'));
  }

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});
exports.getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({ status: 'success', data: { user } });
});
exports.createNewUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(({ msg }) => msg)
      .join('. ');
    return next(new AppError(400, errorMsg));
  }

  const salt = await bcrypt.genSalt(12);

  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role
  });
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { newUser }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const { user: updatedUser } = req;
  const data = filterObj(req.body, 'username', 'email', 'password', 'role');

  if (data.password) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;
  }

  await updatedUser.update({ ...data });

  res.status(204).json({
    status: 'success'
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user: deletedUser } = req;

  if (!deletedUser) {
    return next(new AppError(404, 'Cant delete user, invalid ID'));
  }

  await deletedUser.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

exports.logintUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: 'active' } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    data: { token }
  });
});
