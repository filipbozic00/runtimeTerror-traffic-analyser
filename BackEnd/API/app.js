var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/projektnaNaloga';
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var carsRouter = require('./routes/CarsRoutes');
var cameraRouter = require('./routes/CameraRoutes');
var gpsRouter = require('./routes/GPSRoutes');
var licensePlateRouter = require('./routes/LicensePlateRoutes');
var trafficSignRouter = require('./routes/TrafficSignRoutes');
var trafficSignImagesRouter = require('./routes/TrafficSignImagesRoutes');
var scraperRouter = require('./routes/ScraperRoutes');

var app = express();

var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
// app.use(cors({
//   credentials: true,
//   origin: function(origin, callback) {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1) {
//       var msg = 'The CORS policy for this site does not allow access from the specified origin';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }))

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cars', carsRouter);
app.use('/camera', cameraRouter);
app.use('/gps', gpsRouter);
app.use('/licenseplates', licensePlateRouter);
app.use('/trafficsign', trafficSignRouter);
app.use('/trafficsignimages', trafficSignImagesRouter);
app.use('/scrape', scraperRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
