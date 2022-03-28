const express = require('express');
const { body } = require('express-validator');

const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  logintUser
} = require('../controllers/users.controller');

const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middleware');

const {
  userExists,
  protectAccountOwner
} = require('../middlewares/users.middleware');

const router = express.Router();

router.post(
  '/',
  [
    body('username')
      .isString()
      .withMessage('User Name must be a string')
      .notEmpty()
      .withMessage('Must Provide a valid User Name'),
    body('email')
      .isString()
      .withMessage('Email must be a string')
      .notEmpty()
      .withMessage('Must Provide a valid Email'),
    body('password')
      .isString()
      .withMessage('Password must be a string')
      .notEmpty()
      .withMessage('Must Provide a valid Password')
  ],
  createNewUser
);

router.post('/login', logintUser);

router.use(validateSession);

router.get('/', protectAdmin, getAllUsers);

router
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { userRouter: router };
