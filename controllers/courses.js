const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

// @desc Get courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampsId/courses
// @access PUBLIC

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampsId) {
    courses = await Course.find({ bootcamp: req.params.bootcampsId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advanceResultsr);
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc Get course
// @route GET /api/v1/courses/:id
// @access PUBLIC

exports.getCourse = asyncHandler(async (req, res, next) => {
  course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Add course
// @route POST /api/v1/bootcamps/:bootcampsId/courses
// @access PRIVATE
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampsId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampsId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id of ${req.params.bootcampsId}`,
        404
      )
    );
  }
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Update course
// @route PUt /api/v1/courses/:id
// @access PRIVATE
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`, 404)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Delete course
// @route DELETE /api/v1/courses/:id
// @access PRIVATE
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`, 404)
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
