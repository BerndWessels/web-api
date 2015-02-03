/**
 * This route processes the oauth2 accesscode and tokens.
 */
/* jslint node: true */
'use strict';

/**
 * External dependencies.
 */
var jwt = require('jsonwebtoken');
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
 * Refresh an expired access token.
 */
function exchangeToken(req, res) {
  // Find the expired access token.
  db.accessTokens.find(req.body.accesstoken, function (err, accesstokendata) {
    // Deal with errors.
    if (err) {
      // HTTP status 401: Unauthorized
      res.status(401).send('Unauthorized');
      return;
    }
    // Make sure it was found.
    if (!accesstokendata) {
      // HTTP status 401: NotFound
      res.status(401).send('Unauthorized');
      return;
    }
    // Return if it is not yet expired.
    if(new Date(accesstokendata.expirationDate) > new Date()) {
      res.send(req.body.accesstoken);
      return;
    }
    // Request a new access tokens.
    request.post(
      config.authorization.url + config.authorization.tokenURL,
      {
        form: {
          refresh_token: accesstokendata.refreshToken,
          redirect_uri: config.authorization.redirectURL,
          client_id: config.client.clientID,
          client_secret: config.client.clientSecret,
          grant_type: 'refresh_token'
        }
      },
      function (error, response, body) {
        //Success.
        if (!error && response.statusCode == 200) {
          // Parse the body.
          var authorization = JSON.parse(body);
          // Decode the JWT.
          var newAccessToken = jwt.verify(authorization.access_token, config.client.clientSecret);
          var refreshToken = jwt.verify(accesstokendata.refreshToken, config.client.clientSecret);
          // Delete the old access token.
          db.accessTokens.delete(req.body.accesstoken, function (err, result) {
            if (err) {
              // HTTP status 401: NotFound
              res.status(401).send('Unauthorized');
              return;
            }
            // Save the new access token.
            db.accessTokens.save(
              authorization.access_token,
              {
                userId: newAccessToken.userId,
                clientId: newAccessToken.clientId,
                clientScope: newAccessToken.clientScope,
                expirationDate: newAccessToken.expirationDate,
                refreshToken: accesstokendata.refreshToken
              },
              new Date(refreshToken.expirationDate), // because we can use it to get a new access token.
              function (err) {
                if (err) {
                  // HTTP status 401: NotFound
                  res.status(401).send('Unauthorized');
                  return;
                }
                // Return the new access token to the client.
                res.send(authorization.access_token);
              });
          });
        }
        else {
          // HTTP status 401: NotFound
          res.status(401).send('Unauthorized');
        }
      }
    );
  });
}

/**
 * Export all routes.
 */
exports = module.exports = function (app) {
  app.route('/authentication/accesstoken').post(exchangeToken);
};
