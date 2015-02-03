/**
 * This is the passport authentication database access.
 *
 * The access token and optionally refresh token.
 * You will use these to access your end point data through the means outlined
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
 * Returns an access token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the access token
 * @param done The function to call next
 * @returns The access token if found, otherwise returns null
 */
exports.find = function (key, done) {
  redisClient.select(config.db.redisdb.db, function (err) {
    if (err) {
      console.log('Error ' + err);
    }
  });
  redisClient.get('accesstoken:' + key, function (err, token) {
    if (err) {
      return done(err, null);
    }
    return done(null, JSON.parse(token));
  });
};

/**
 * Deletes an access token
 * @param key The access token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
  redisClient.select(config.db.redisdb.db, function (err) {
    if (err) {
      console.log('Error ' + err);
    }
  });
  redisClient.del('accesstoken:' + key, function (err) {
    if (err) {
      console.log(err);
      return done(err, null);
    }
    return done(null);
  });
};

/**
 * Saves a access token, expiration date, user id, client id, and scope.
 * @param token The access token (required)
 * @param expirationDate The expiration of the access token that is a javascript Date() object (required)
 * @param userID The user ID (required)
 * @param clientID The client ID (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (token, data, expirationDate, done) {
  redisClient.select(config.db.redisdb.db, function (err) {
    if (err) {
      console.log('Error ' + err);
    }
  });
  redisClient.set('accesstoken:' + token, JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
        return done(err, null);
      }
      redisClient.expire('accesstoken:' + token, parseInt((expirationDate.getTime() - new Date().getTime()) / 1000, 10), function (err) {
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
 * Removes all access tokens.
 * @param done returns this when done.
 */
exports.removeAll = function (done) {
  redisClient.keys('accesstoken:*', function (err, rows) {
    if (err) {
      console.log(err);
    }
    for (var i = 0, j = rows.length; i < j; ++i) {
      redisClient.del(rows[i], function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
  return done(null);
};
