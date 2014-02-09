var assert = require('assert');

module.exports = function() {
  'use strict';

  this.World = require('../support/world').World;

  this.Given(/^I invoke the tool with custom features option$/, function(callback) {
    // Custom features directory is actually done in World when cli is run.
    // Reason being, I couldnt provide the default features (where we are currently) of this library,
    //  due to exceptions from inception ;)
    this.runCli([], callback);
  });

  this.Then(/^The bundled features are accessible on the window global$/, function(callback) {
    this.visit(function(error, window) {
      if(error) {
        assert.equal(true, false, 'Browser failed: ' + error);
      }
      else {
        assert(/^Feature: Message Display?/i.test(window.cukefeatures), true,
          'Features not properly transferred using custom features option.');
      }
    }, callback);
  });

  this.After(function(callback) {
    this.cleanOut(callback);
  });

};
