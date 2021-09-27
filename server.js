const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Demo changes
// Demo Changes 2222

// Demo changes again
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const superAdmin = require('./routes/superAdmin');
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
// Import Express mongo sanitize
const mongoSanitize = require('express-mongo-sanitize');
// Import helmet
const helmet = require('helmet');
// Import XSS-Clean
const xss = require('xss-clean');
// Import express-rate-limit
const rateLimit = require('express-rate-limit');
// Import hpp(HTTP Params pollution)
const hpp = require('hpp');
// Import CORS
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });
// Passport config
require('./config/passport')(passport);

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

// Add mongo sanitize middleware as global middleware
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent criss site scripting attacks
app.use(xss());

// Add rate limit(limiting no of calls that can be made in certain time)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Prevent http params pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.listen(
  PORT,
  console.log(`Server running on ${PORT} in ${process.env.NODE_ENV} mode`)
);

// Mount routes

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admin', admin);
app.use('/api/v1/superadmin', superAdmin);
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
