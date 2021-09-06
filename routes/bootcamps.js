const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamps,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advanceResults = require('../middleware/advanceResults');

// Include other resource routes
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampsId/courses', courseRouter);

router
  .route('/')
  .get(advanceResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamps);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamps)
  .delete(deleteBootcamps);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
