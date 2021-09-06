const ErrorResponse = require('../utils/errorResponse');

const errorhandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // log to console for dev
  console.log(err.stack);
  console.log(err);
  // Duplicate key error
  if (err.code === 11000) {
    const message = `Resource not added as the name ${err.keyValue.name} is already taken`;
    error = new ErrorResponse(message, 400);
  }
  // Required fieds not entered error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  //   Mongoose bad Object ID
  if (err.name === 'CastError') {
    const message = `Resource not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  });
};

module.exports = errorhandler;
