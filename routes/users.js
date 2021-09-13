const express = require('express');
const passport = require('passport');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router();

// const { protect, authorize } = require('../middleware/auth');
const advanceResults = require('../middleware/advanceResults');

router.use(passport.authenticate(['admin'], { session: false }));
router.route('/').get(advanceResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
