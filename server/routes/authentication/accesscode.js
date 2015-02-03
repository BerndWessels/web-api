/**
 * This route processes the oauth2 accesscode and tokens.
 */
/* jslint node: true */
'use strict';

/**
 * External dependencies.
 */
var request = require('request');

/**
 * Internal dependencies.
 */
var config = require('../../config');
var db = require('../../db/token/' + config.db.type);

/**
 * Internal dependencies.
 */
var config = require('../../config');

/**
 * Exchange the client access code for the oauth2 access token.
 */
function exchangeToken(req, res) {
  // Find the client access code.
  db.authorizationCodes.find(req.body.accesscode, function (err, accesstoken) {
    // Deal with errors.
    if (err) {
      res.send(err);
      return;
    }
    // Make sure it was found.
    if (!accesstoken) {
      res.send(''); // TODO http err not found
      return;
    }
    // Delete it.
    db.authorizationCodes.delete(req.body.accesscode, function (err, result) {
      if (err) {
        res.send(err);
        return;
      }
      // Return the access token to the client.
      res.send(accesstoken);
    });
  });
}

/**
 * Export all routes.
 */
exports = module.exports = function (app) {
  app.route('/authentication/accesscode').post(exchangeToken);
};
