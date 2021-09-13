const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const SuperAdmin = require('../models/SuperAdmin');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc Register Super Admin
// @route POST /api/v1/superadmin/registerAdmin
// @access SUPER-ADMIN
exports.registerSAdmin = asyncHandler(async (req, res, next) => {
  console.log('hello');
  const { name, email, password, role } = req.body;
  const sadmin = await SuperAdmin.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(sadmin, 200, res);
});

// @desc Login Super Admin
// @route POST /api/v1/superadmin/loginAdmin
// @access SUPER-ADMIN
exports.loginSAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // find user
  const sadmin = await SuperAdmin.findOne({ email });

  // console.log('token');
  sendTokenResponse(sadmin, 200, res);
});

// @desc Get all users
// @route GET /api/v1/auth/users
// @access PRIVATE/ADMIN
exports.getAdmins = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

// Helper function to create a token
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token

  const token = admin.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
