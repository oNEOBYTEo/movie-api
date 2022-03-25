const express = require('express');

const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  logintUser
} = require('../controllers/users.controller');

const { validate, protectAdmin } = require('../middlewares/auth.middleware');

const {
  userExists,
  protectAccountOwner
} = require('../middlewares/users.middleware');

const router = express.Router();

router.post('/', createNewUser);

router.post('/login', logintUser);

router.use(validate);

router.get('/', protectAdmin, getAllUsers);

router
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectAccountOwner, updateUser)
  .delete(protectAccountOwner, deleteUser);

module.exports = { userRouter: router };
