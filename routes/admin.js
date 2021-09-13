const express = require('express');
const passport = require('passport');
const { registerAdmin, loginAdmin } = require('../controllers/admin');

const router = express.Router();

router.post('/registerAdmin', registerAdmin);
router.post(
  '/loginAdmin',
  passport.authenticate(['localAdmin'], { session: false }),
  loginAdmin
);
module.exports = router;
