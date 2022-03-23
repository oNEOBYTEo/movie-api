const express = require('express');

const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  logintUser
} = require('../controllers/users.controller');

const { validate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', createNewUser);
router.post('/login', logintUser);

router.use(validate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = { userRouter: router };
