const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Use bcrypt for passwords as it is difficult to reverse the hash
const crypto = require('crypto'); // Used for hashing tokens
const jwt = require('jsonwebtoken');

const SuperAdminSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    default: 'super-admin',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlenght: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    date: Date.now,
  },
});

// Encrypting password using bcrypt
SuperAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
SuperAdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Check if entered password matches with hashed password
SuperAdminSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and has the password reset token
SuperAdminSchema.methods.getResetPasswordToken = function () {
  // Generate the token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the token and set it to resetPasswordToken in the schema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expiry for the token i.e 10min
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model('SuperAdmin', SuperAdminSchema);
