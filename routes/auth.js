const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  getMe,
  resetPassword,
  sendResetToken,
  updateUser,
  updatePassword,
  logout,
} = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post(
  '/login',
  passport.authenticate(['local'], { session: false }),
  login
);
// router.post('/login', authorize('admin'), login);
router.get('/logout', logout);
router.get('/me', passport.authenticate(['user'], { session: false }), getMe);
// router.get('/me', protect, getMe);
router.put(
  '/updatedetails',
  passport.authenticate(['user'], { session: false }),
  updateUser
);
// router.put('/updatedetails', protect, updateUser);
router.put(
  '/updatepassword',
  passport.authenticate(['user'], { session: false }),
  updatePassword
);
// router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', sendResetToken);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
