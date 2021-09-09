const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc Get all users
// @route GET /api/v1/auth/users
// @access PRIVATE/ADMIN
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

// @desc Get single user
// @route GET /api/v1/auth/users/:id
// @access PRIVATE/ADMIN
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Create User
// @route POST /api/v1/auth/users
// @access PRIVATE/ADMIN
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc Update User
// @route PUT /api/v1/auth/users/:id
// @access PRIVATE/ADMIN
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Delete User
// @route DELETE /api/v1/auth/users/:id
// @access PRIVATE/ADMIN
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});