var assert = require('assert');

module.exports = function() {
  'use strict';

  this.World = require('../support/world').World;

  this.When(/^I use double\-quotes like "([^"]*)"$/, function(arg1, callback) {
    assert.notEqual(arg1, undefined, 'Double-quoted param is not provide in step definition.');
    callback();
  });

};
