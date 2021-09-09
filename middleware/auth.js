const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  // Check for authorization and if the token is starting with Bearer or not & extract the token from the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log(req.headers);
    token = req.headers.authorization.split(' ')[1];
  }
  // else if(req.cookies.token){
  //     token = req.cookies.token
  // }

  // Check for the token
  if (!token) {
    return next(new ErrorResponse('Authorization failed', 401));
  }
  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Authorization failed', 401));
  }
});
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized for this action`,
          403
        )
      );
    }
    next();
  };
};
