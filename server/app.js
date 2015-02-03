/**
 * This is the api server entry-point.
 */
/* jslint node: true */
'use strict';

/**
 * External dependencies.
 */
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var errorHandler = require('errorhandler');
var express = require('express');
var fs = require('fs');
var methodOverride = require('method-override');
var morgan = require('morgan');
var multer = require('multer');
var path = require('path');
var request = require('request');
var serveFavicon = require('serve-favicon');

/**
 * Internal dependencies.
 */
var config = require('./config');

/**
 * Create and configure the api application server.
 */
// Create the application.
var app = express();
// Get the current environment.
var env = app.get('env');
// Set the listening port.
app.set('port', config.port);

/**
 * Add the common middleware.
 */
// Compress every response.
app.use(compression());
// Development environment.
if (env === 'development' || env === 'test') {
  // Use logging.
  app.use(morgan('dev'));
}
// Use custom method overriding.
app.use(methodOverride());
// Parse JSON request bodies.
app.use(bodyParser.json({}));
// Parse URL encoded request bodies.
app.use(bodyParser.urlencoded({extended: true}));
// Parse multi-part request bodies.
app.use(multer());
// Parse the cookies.
app.use(cookieParser());
// Enable cross origin requests.
app.use(cors());

/**
 * Protect the API.
 */
app.use(function (req, res, next) {
  next();
});

/**
 * Add the routes.
 */
// Register all routes.
require('./utils').walkSync('./routes').forEach(function (file) {
  // Load the route file.
  require(file)(app);
});

/**
 * Run the api application server.
 */
// Handle errors.
if (env === 'development' || env === 'test') app.use(errorHandler());
// Start listening.
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
