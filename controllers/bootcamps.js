const path = require('path');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access PUBLIC
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if we have two res.status then we'll get a change in headers error so return the first one
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(400).json({
    success: true,
    data: bootcamp,
  });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access PRIVATE
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  // Check for published bootcamps
  const publishedBootcamps = await Bootcamp.findOne({ user: req.user.id });
  // If the user is not an admin they can add onlu one bootcamp
  if (publishedBootcamps && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already created a bootcamp`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    sucess: true,
    data: bootcamp,
  });
});

// @desc Update single bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access PRIVATE
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // Check if the user is the owner of the bootcamp or not
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update the bootcamp`
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    body: bootcamp,
  });
});

// @desc Delete single bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access PRIVATE
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  // Check if the user is the owner of the bootcamp or not
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete the bootcamp`
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    body: {},
  });
});

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access PUBLIC
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // Get lg/lt from the geocoder
  const loc = await geocoder.geocode(zipcode);
  const lt = loc[0].latitude;
  const lg = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of earth
  // Earth Radius =6378km
  const radius = distance / 3693;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lg, lt], radius] },
    },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    coordinate: [lt, lg],
    radius: radius,
    data: bootcamps,
  });
});

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access PRIVATE
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  // console.log(process.env);
  const file = req.files.file;

  // Make sure the uploaded file is an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Checck/limit the size of the image
  if (file.size > process.env.MAX_FILE_UPLOADS) {
    return next(
      new ErrorResponse(
        `Please upload an image file of size less than 1MB`,
        400
      )
    );
  }

  // Create custom file name so that the files do not get overwritten when a different file of the same name is uploaded
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Failed to upload the file`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      status: true,
      data: file.name,
    });
  });
});
