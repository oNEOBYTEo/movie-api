const express = require('express');
const { body } = require('express-validator');

const {
  getAllActors,
  getActorById,
  createNewActor,
  updateActor,
  deleteActor
} = require('../controllers/actors.controller');

const {
  validateSession,
  protectAdmin
} = require('../middlewares/auth.middleware');

const { upload } = require('../util/multer');

const router = express.Router();

router.use(validateSession);

router
  .route('/')
  .get(getAllActors)
  .post(
    [
      protectAdmin,
      upload.single('img'),
      body('name').isString().notEmpty(),
      body('country')
        .isString()
        .withMessage('Country must be a string')
        .notEmpty()
        .withMessage('Must provide a valid countr name'),
      body('rating')
        .isNumeric()
        .withMessage('Rating must be a number')
        .custom((value) => {
          return value > 0 && value <= 5;
        })
        .withMessage('Rating must be between 1 and 5'),
      body('age')
        .isNumeric()
        .withMessage('Age must be a number')
        .custom((value) => value > 0 && value < 120)
        .withMessage('Age must be greater than 0 and less than 120')
    ],
    createNewActor
  );

router
  .route('/:id')
  .get(getActorById)
  .patch(protectAdmin, updateActor)
  .delete(protectAdmin, deleteActor);

module.exports = { actorsRouter: router };
