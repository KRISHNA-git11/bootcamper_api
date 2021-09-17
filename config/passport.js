const LocalStrategy = require('passport-local').Strategy;
const JwtStratagey = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const AnonymousStrategy = require('passport-anonymous').Strategy;
// const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
// const ErrorResponse = require('../utils/errorResponse');

// Load user model

const User = require('../models/User');
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');

var cookieExtractor = (req) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  //   console.log(req);
  //   if (req && req.signedCookies && req.signedCookies.jwt) {
  //     token = req.signedCookies['jwt']['token'];
  //   }
  return token;
};

module.exports = function (passport) {
  passport.use('anonymous', new AnonymousStrategy());
  passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match User
      User.findOne({ email: email, active: true })
        .select('+password')
        .then((user) => {
          //   console.log(user);
          if (!user) {
            // return next(new ErrorResponse('user not found', 404));
            return done(null, false, { message: 'User not found' });
          }

          // Match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password wrong' });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  passport.use(
    'localAdmin',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match User
      Admin.findOne({ email: email, active: true })
        .select('+password')
        .then((user) => {
          //   console.log(user);
          if (!user) {
            // return next(new ErrorResponse('user not found', 404));
            return done(null, false, { message: 'User not found' });
          }

          // Match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password wrong' });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  passport.use(
    'superlocal',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match User
      SuperAdmin.findOne({ email: email })
        .select('+password')
        .then((user) => {
          //   console.log(user);
          if (!user) {
            // return next(new ErrorResponse('user not found', 404));
            return done(null, false, { message: 'User not found' });
          }

          // Match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password wrong' });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  passport.use(
    'user',
    new JwtStratagey(
      {
        secretOrKey: process.env.JWT_SECRET,
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: cookieExtractor,
      },
      (jwt_payload, done) => {
        User.findById({ _id: jwt_payload.id }, (err, user) => {
          if (err) {
            return done(err, false);
            //   throw err;
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );
  passport.use(
    'admin',
    new JwtStratagey(
      {
        secretOrKey: process.env.JWT_SECRET,
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: cookieExtractor,
      },
      (jwt_payload, done) => {
        Admin.findOne({ _id: jwt_payload.id, active: true }, (err, user) => {
          if (err) {
            let errorMessage = new ErrorResponse('unauthorized access', 401);
            return done(err + errorMessage, false);
            //   throw err;
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );
  passport.use(
    'superadmin',
    new JwtStratagey(
      {
        secretOrKey: process.env.JWT_SECRET,
        // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: cookieExtractor,
      },
      (jwt_payload, done) => {
        SuperAdmin.findOne(
          { _id: jwt_payload.id, active: true },
          (err, user) => {
            if (err) {
              let errorMessage = new ErrorResponse('unauthorized access', 401);
              console.log(err);
              return done(err + errorMessage, false);
              //   throw err;
            }
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          }
        );
      }
    )
  );
};
