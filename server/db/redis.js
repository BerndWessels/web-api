/**
 * This is the redis database access.
 */
/* jslint node: true */
'use strict';

/**
 * Internal dependencies.
 */
var config = require('../config');
var redis = require('redis');

/**
 * Create and configure the redis client.
 */
var redisClient = redis.createClient(config.db.redisdb.port, config.db.redisdb.host);

redisClient.on('error', function (err) {
  console.log('Error ' + err);
});

redisClient.on('connect', function () {
  console.log('Redis client is connected to ' + config.db.redisdb.host + ':' + config.db.redisdb.port);
});

/**
 * Export the redis database access.
 */
exports.redis = redis;
exports.redisClient = redisClient;
