const express = require('express');
const passport = require('passport');
const { registerAdmin, loginAdmin } = require('../controllers/admin');
const { changeStatus } = require('../controllers/changeStatus');

const router = express.Router();

router.post('/registerAdmin', registerAdmin);
router.post(
  '/loginAdmin',
  passport.authenticate(['localAdmin'], { session: false }),
  loginAdmin
);

router.post('/changeStatus/:id', changeStatus);
module.exports = router;
