const express = require('express');
const passport = require('passport');
const {
  registerSAdmin,
  loginSAdmin,
  getAdmins,
} = require('../controllers/superadmin');
const advanceResults = require('../middleware/advanceResults');
const Admin = require('../models/Admin');

const router = express.Router();

router.post('/registerSuperAdmin', registerSAdmin);
router.post(
  '/loginSuperAdmin',
  passport.authenticate(['superlocal'], { session: false }),
  loginSAdmin
);
router.get(
  '/getadmins',
  advanceResults(Admin),
  passport.authenticate(['superadmin'], { session: false }),
  getAdmins
);
module.exports = router;
