/**
 * This is the passport authentication database access.
 *
 * The authorization codes.
 * You will use these to get the access codes to get to the data in your endpoints as outlined
 * in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
 * (http://tools.ietf.org/html/rfc6750)
 */
/* jslint node: true */
'use strict';

/**
 * Internal dependencies.
 */
var config = require('../../../config');
var redisClient = require('../../redis').redisClient;

/**
 * Returns an authorization code if it finds one, otherwise returns
 * null if one is not found.
 * @param code The key to the authorization code
 * @param done The function to call next
 * @returns The authorization token if found, otherwise returns null
 */
exports.find = function (code, done) {
  redisClient.select(config.db.redisdb.db, function (err) {
    if (err) {
      console.log('Error ' + err);
    }
  });
  redisClient.get('accesscode:' + code, function (err, token) {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    return done(null, token);
  });
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param code The authorization code (required)
 * @param token The associated access token (required)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (code, token, done) {
  redisClient.select(config.db.redisdb.db, function (err) {
    if (err) {
      console.log('Error ' + err);
    }
  });
  redisClient.set('accesscode:' + code, token, function (err) {
      if (err) {
        console.log(err);
        return done(err, null);
      }
      redisClient.expire('accesscode:' + token, config.accessCode.expiresIn, function (err) {
        if (err) {
          console.log(err);
          return done(err, null);
        }
        return done(null);
      });
    }
  );
};

/**
 * Deletes an authorization code
 * @param key The authorization code to delete
 * @param done Calls this with null always
 */
exports.delete = function (key, done) {
  redisClient.select(config.db.redisdb.db, function (err) {
    if (err) {
      console.log('Error ' + err);
    }
  });
  redisClient.del('accesscode:' + key);
  return done(null);
};
