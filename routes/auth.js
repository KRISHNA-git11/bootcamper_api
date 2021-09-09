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
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateUser);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', sendResetToken);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
