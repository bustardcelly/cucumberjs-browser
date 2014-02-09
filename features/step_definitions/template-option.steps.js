var assert = require('assert');

module.exports = function() {
  'use strict';

  this.World = require('../support/world').World;

  this.Given(/^I invoke the tool with custom template option$/, function(callback) {
    // Custom template is actually done in World when cli is run.
    // Reason being, I couldnt provide the default template of this library,
    //  due to exceptions from inception ;)
    this.runCli([], callback);
  });

  this.Then(/^The testrunner document should be generated$/, function(callback) {
    // The custom template defined and used in World has a message-field element on the DOM.
    // We'll use its existence to assert this as passing grade.
    this.visit(function(error, window) {
      if(error) {
        assert.equal(true, false, 'Browser failed: ' + error);
      }
      else {
        assert.equal(window.document.querySelectorAll('#message-field').length, 1,
          'The #message-field element is not accessible on the generated custom template.');
      }
    }, callback);
  });

  this.After(function(callback) {
    this.cleanOut(callback);
  });

};