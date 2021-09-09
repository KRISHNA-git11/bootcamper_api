const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampsId/reviews
// @access PUBLIC
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampsId) {
    reviews = await Review.find({ bootcamp: req.params.bootcampsId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advanceResults);
  }
});

// @desc Get single review
// @route GET /api/v1/reviews/:id
// @access PUBLIC
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!review) {
    return next(new ErrorResponse('No review found with the id', 404));
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Add review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access PRIVATE
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampsId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampsId);
  //   console.log(req.params.bootcampId)
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    );
  }
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc Update review
// @route PUT /api/v1/reviews/:id
// @access PRIVATE
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse('No review found', 404));
  }
  // Make sure review belongs to the user or is a admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized action', 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Delete review
// @route DELETE /api/v1/reviews/:id
// @access PRIVATE
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse('No review found', 404));
  }
  // Make sure review belongs to the user or is a admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized action', 401));
  }

  review = await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
