const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Import db
const connectDB = require('./config/db');

// middleware files
// const logger = require('./middleware/logger');
const morgan = require('morgan');
// Import error handler
const errorhandler = require('./middleware/error');
// Import file uploader
const fileUpload = require('express-fileupload');
// Import cookie parser
const cookieParser = require('cookie-parser');
// Import passport
const passport = require('passport');

// Passport config
require('./config/passport')(passport);
// Load env vars

dotenv.config({ path: './config/config.env' });

// Connect DB

connectDB();

// init app

const app = express();

const PORT = process.env.PORT || 5000;

// Body parser - to grant access to accept JSON data to the body
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Cookie parser
app.use(cookieParser());

// Mount middleware
// app.use(logger);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploader
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(
  PORT,
  console.log(`Server running on ${PORT} in ${process.env.NODE_ENV} mode`)
);

app.get('/', (req, res) => {
  res.send('Hello API');
});

// Mount routes

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Eroor handling
app.use(errorhandler);

// // Handle unhandled promise rejections
// process.on('UnhandledPromiseRejectionWarning', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server and exit process
//   server.close(() => process.exit(1));
// });
