/**
 * This is the passport authentication database access.
 *
 * The refresh tokens.
 * You will use these to get access tokens to access your end point data through the means outlined
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
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the refresh token
 * @param done The function to call next
 * @returns The refresh token if found, otherwise returns null
 */
exports.find = function (key, done) {
    redisClient.select(config.db.redisdb.db, function (err) {
        if (err) {
            console.log('Error ' + err);
        }
    });
    redisClient.get('refreshtoken:' + key, function (err, token) {
        if (err) {
            console.log(err);
            return done(err, null);
        }
        return done(null, JSON.parse(token));
    });
};

/**
 * Saves a refresh token, user id, client id, and scope.
 * @param token The refresh token (required)
 * @param userID The user ID (required)
 * @param clientID The client ID (required)
 * @param scope The scope (optional)
 * @param clientSecret The client secret (required)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (token, userID, clientID, scope, clientSecret, done) {
    redisClient.select(config.db.redisdb.db, function (err) {
        if (err) {
            console.log('Error ' + err);
        }
    });
    console.log('refreshtoken.set');
    redisClient.set('refreshtoken:' + token, JSON.stringify(
            {
                userID: userID,
                clientID: clientID,
                scope: scope,
                clientSecret: clientSecret
            }),
        function (err) {
            if (err) {
                console.log(err);
                return done(err, null);
            }
            return done(null);
        }
    );
};

/**
 * Deletes a refresh token
 * @param key The refresh token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
    redisClient.select(config.db.redisdb.db, function (err) {
        if (err) {
            console.log('Error ' + err);
        }
    });
    console.log('refreshtoken.del');
    redisClient.del('refreshtoken:' + key, function (err) {
        if (err) {
            console.log(err);
            return done(err, null);
        }
        return done(null);
    });
};
