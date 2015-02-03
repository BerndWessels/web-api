/**
 * This route returns stuff to the home page.
 */
/* jslint node: true */
'use strict';

/**
 * External dependencies.
 */

/**
 * Internal dependencies.
 */

/**
 * Receive the OAuth2 access code.
 */
function getStuff(req, res) {
  res.send({something: 'Homepage stuff.'});
}

/**
 * Export all routes.
 */
exports = module.exports = function (app) {
  app.route('/api/home/stuff').get(getStuff);
};
