const { User } = require('../models/user.model');

const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id, status: 'active' },
    attributes: { exclude: 'password' }
  });

  if (!user) {
    return next(new AppError(404, 'No user found with the given ID'));
  }

  req.user = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentUser } = req;

  if (currentUser.id !== +id) {
    return next(new AppError(403, `You can't update others user accounts`));
  }

  next();
});
