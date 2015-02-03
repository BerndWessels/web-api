/**
 * This is the default environment configuration.
 */
/* jslint node: true */
'use strict';

/**
 * External dependencies.
 */
var path = require('path');
var _ = require('lodash');

/**
 * Set the default node environment to development.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * The default configurations.
 */
var all = {
  /**
   * The node environment.
   */
  env: process.env.NODE_ENV,

  /**
   * Root path of the server.
   */
  root: path.normalize(__dirname + '/../..'),

  /**
   * The Server port.
   */
  port: process.env.PORT || 8000,

  /**
   * The client id and the client secret.
   *
   * We are using a "trusted" client so that we don't get the "decision" screen.
   */
  client: {
    clientID: "trustedClient",
    clientSecret: "ssh-otherpassword"
  },

  /**
   * The Authorization server's location, port number, and the token info end point.
   */
  authorization: {
    host: "localhost",
    port: "3000",
    url: "http://localhost:3000/",
    tokenURL: "oauth/token",
    authorizeURL: "http://localhost:3000/dialog/authorize",
    tokeninfoURL: "http://localhost:3000/api/tokeninfo?access_token=",
    redirectURL: "http://localhost:8000/authorization/accesscode"
  },

  /**
   * The client web-site cdn location.
   */
  cdn: {
    redirectURL: 'http://localhost:9000/authentication/accesscode'
  },

  /**
   * Database configuration for access and refresh tokens.
   */
  db: {
    type: "redisStore",
    redisdb: {
      host: '127.0.0.1',
      port: 6379,
      db: 2
    }
  },

  /**
   * Configuration of client access code.
   */
  accessCode: {
    expiresIn: 30, // seconds
    accessCodeLength: 16
  }
};

/**
 * Export the config object based on the NODE_ENV.
 */
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {}
);
