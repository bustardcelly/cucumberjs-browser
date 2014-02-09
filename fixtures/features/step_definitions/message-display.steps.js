var assert = require('assert');

module.exports = function() {
  'use strict';

  var expectedMessage = 'hello, world';

  this.Given(/^I am on the home page$/, function(callback) {
    this.route('home');
    callback();
  });

  this.When(/^I click the add\-message button$/, function(callback) {
    this.dispatchClickEvent(this.query('#add-message-button'));
    callback();
  });

  this.Then(/^I am shown a 'hello, world' message$/, function(callback) {
    assert.equal(this.query('#message-field').textContent, expectedMessage, 'Message upon click of button should be ' + expectedMessage);
    callback();
  });

};