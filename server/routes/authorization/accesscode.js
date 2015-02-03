/**
 * This route processes the oauth2 accesscode and tokens.
 *
 * The authentication server redirects the client here after a successful login.
 * We then try to exchange the access code for the access and refresh tokens.
 * And then we redirect the client back to the SPA on the CDN.
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
var utils = require('../../utils');

/**
 * Receive the OAuth2 access code.
 */
function receiveToken(req, res) {
  // Request the refresh and access tokens.
  request.post(
    config.authorization.url + config.authorization.tokenURL,
    {
      form: {
        code: req.query.code,
        redirect_uri: config.authorization.redirectURL,
        client_id: config.client.clientID,
        client_secret: config.client.clientSecret,
        grant_type: 'authorization_code'
      }
    },
    function (error, response, body) {
      //Success.
      if (!error && response.statusCode == 200) {
        // Parse the body.
        var authorization = JSON.parse(body);
        // Decode the JWT.
        var accessToken = jwt.verify(authorization.access_token, config.client.clientSecret);
        var refreshToken = jwt.verify(authorization.refresh_token, config.client.clientSecret);
        // Create a new client access code.
        var code = utils.uid(config.accessCode.accessCodeLength);
        // Store client access code - authorization.
        db.authorizationCodes.save(code, authorization.access_token, function (err) {
          if (err) {
            res.send(err);
            return;
          }
          // Store access token - authorization.
          db.accessTokens.save(
            authorization.access_token,
            {
              userId: accessToken.userId,
              clientId: accessToken.clientId,
              clientScope: accessToken.clientScope,
              expirationDate: accessToken.expirationDate,
              refreshToken: authorization.refresh_token
            },
            new Date(refreshToken.expirationDate), // because we can use it to get a new access token.
            function (err) {
              if (err) {
                res.send(err);
                return;
              }
              // Redirect back to the CDN and provide the access code.
              res.redirect(config.cdn.redirectURL + '/' + code);
            });
        });
      }
      // Failure.
      else {
        res.send(error);
      }
    }
  );
}

/**
 * Export all routes.
 */
exports = module.exports = function (app) {
  app.route('/authorization/accesscode').get(receiveToken);
};
