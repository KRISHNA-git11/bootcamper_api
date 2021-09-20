const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc Register Admin
// @route POST /api/v1/admin/registerAdmin
// @access ADMIN
exports.registerAdmin = asyncHandler(async (req, res, next) => {
  console.log('hello');
  const { name, email, password, role } = req.body;
  const admin = await Admin.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(admin, 200, res);
});

// @desc Login Admin
// @route POST /api/v1/admin/loginAdmin
// @access ADMIN
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // find user
  const admin = await Admin.findOne({ email });

  // console.log('token');
  sendTokenResponse(admin, 200, res);
});

// // @desc Get user logged out
// // @route GET /api/v1/auth/logout
// // @access PRIVATE
// exports.logout = asyncHandler(async (req, res, next) => {
//   res.cookie('token', 'none', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });
//   res.status(200).json({
//     success: true,
//     data: {},
//   });
// });

// // @desc Get the current logged in user
// // @route GET /api/v1/auth/me
// // @access PRIVATE
// exports.getMe = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     data: user,
//   });
// });

// // @desc Forgot Password
// // @route POST /api/v1/auth/forgotpassword
// // @access PUBLIC
// exports.sendResetToken = asyncHandler(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new ErrorResponse('There is no user with this email ', 404));
//   }

//   // Get reset token
//   const resetToken = user.getResetPasswordToken();

//   console.log(resetToken);
//   await user.save({
//     validateBeforeSave: false,
//   });

//   // Create reset url
//   const resetUrl = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/auth/resetpassword/${resetToken}`;

//   const message = `Please make a PUT request to: \n\n ${resetUrl} `;
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Password rest link',
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       data: 'Email sent',
//     });
//   } catch (error) {
//     console.log(error);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({
//       validateBeforeSave: false,
//     });

//     return next(new ErrorResponse('Email could not be sent', 500));
//   }

//   // res.status(200).json({
//   //   success: true,
//   //   data: user,
//   // });
// });

// // @desc Reset password
// // @route PUT /api/v1/auth/resetpassword/:resettoken
// // @access PUBLIC
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   // get token from url and hash it to match the token in th db
//   const resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(req.params.resettoken)
//     .digest('hex');

//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new ErrorResponse('Invalid token', 400));
//   }

//   // Set new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;

//   await user.save();

//   sendTokenResponse(user, 200, res);
// });

// // @desc Update user details by the user
// // @route PUT /api/v1/auth/updatedetails
// // @access PRIVATE
// exports.updateUser = asyncHandler(async (req, res, next) => {
//   const fieldsToUpdate = {
//     name: req.body.name,
//     email: req.body.email,
//   };
//   const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
//     new: true,
//     runValidators: true,
//   });

//   sendTokenResponse(user, 200, res);
// });

// // @desc Update password
// // @route GET /api/v1/auth/updatepassword
// // @access PRIVATE
// exports.updatePassword = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select('+password');

//   // Check current user password
//   if (!(await user.checkPassword(req.body.currentPassword))) {
//     return next(new ErrorResponse('Password incorrect', 401));
//   }
//   user.password = req.body.newPassword;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });

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
